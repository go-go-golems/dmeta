package cmds

import (
	"context"
	"fmt"
	"path/filepath"

	genmeta "github.com/go-go-golems/dmeta/pkg/dmeta/generator/metadata"
	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
	pbuimds "github.com/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui"
	"github.com/go-go-golems/dmeta/pkg/dmeta/validator"
	"github.com/go-go-golems/glazed/pkg/cli"
	"github.com/go-go-golems/glazed/pkg/cmds"
	"github.com/go-go-golems/glazed/pkg/cmds/fields"
	"github.com/go-go-golems/glazed/pkg/cmds/schema"
	"github.com/go-go-golems/glazed/pkg/cmds/values"
	"github.com/go-go-golems/glazed/pkg/middlewares"
	"github.com/go-go-golems/glazed/pkg/settings"
	"github.com/go-go-golems/glazed/pkg/types"
	"github.com/pkg/errors"
)

type ScaffoldPBUIReactCommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*ScaffoldPBUIReactCommand)(nil)

type ScaffoldPBUIReactSettings struct {
	Root             string `glazed:"root"`
	InteractionsRoot string `glazed:"interactions-root"`
	PBUIRoot         string `glazed:"pbui-root"`
	OutputDir        string `glazed:"output-dir"`
	DryRun           bool   `glazed:"dry-run"`
	Force            bool   `glazed:"force"`
	MetadataOnly     bool   `glazed:"metadata-only"`
}

func NewScaffoldPBUIReactCommand() (*ScaffoldPBUIReactCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}
	desc := cmds.NewCommandDescription(
		"scaffold-pbui-react",
		cmds.WithShort("Render or dry-run PBUI React target scaffold files"),
		cmds.WithLong(`Render PBUI React target scaffold files.

The command uses the same inputs as plan-pbui-react, then renders TypeScript,
TSX, JSON metadata, Storybook, and README scaffold files. It defaults to dry-run
so Street Deli dogfooding can inspect the full planned write set before files are
created. Use --dry-run=false to write and --force to overwrite existing files.

Examples:
  dmeta scaffold-pbui-react --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --dry-run --output table
`),
		cmds.WithFlags(
			fields.New("root", fields.TypeString, fields.WithDefault("sources/dmeta-ir"), fields.WithHelp("Directory containing the semantic DMETA IR package to elaborate")),
			fields.New("interactions-root", fields.TypeString, fields.WithDefault("sources/dmeta-ir"), fields.WithHelp("Directory containing interactions/ actions, representations, and elaboration rules")),
			fields.New("pbui-root", fields.TypeString, fields.WithDefault("sources/dmeta-ir/meta-design-systems/pbui"), fields.WithHelp("Directory containing a PBUI MetaDesignSystem package")),
			fields.New("output-dir", fields.TypeString, fields.WithDefault(""), fields.WithHelp("Optional output directory for generated PBUI React files")),
			fields.New("dry-run", fields.TypeBool, fields.WithDefault(true), fields.WithHelp("Plan and render files without writing them")),
			fields.New("force", fields.TypeBool, fields.WithDefault(false), fields.WithHelp("Overwrite existing files when not in dry-run mode")),
			fields.New("metadata-only", fields.TypeBool, fields.WithDefault(false), fields.WithHelp("Only write or dry-run metadata sidecars")),
		),
		cmds.WithSections(glazedSection, commandSettingsSection),
	)
	return &ScaffoldPBUIReactCommand{CommandDescription: desc}, nil
}

func (c *ScaffoldPBUIReactCommand) RunIntoGlazeProcessor(ctx context.Context, vals *values.Values, gp middlewares.Processor) error {
	s := &ScaffoldPBUIReactSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode scaffold-pbui-react settings")
	}

	semanticPkg, err := validator.LoadPackage(ctx, s.Root)
	if err != nil {
		return err
	}
	resolved, inheritanceFindings := validator.ResolveCoreInheritance(semanticPkg.CoreModel)
	if validator.HasErrors(inheritanceFindings) {
		return fmt.Errorf("semantic inheritance has error-severity findings; run validate-ir")
	}
	interactionPkg, err := interaction.LoadPackage(ctx, s.InteractionsRoot)
	if err != nil {
		return err
	}
	if findings := interaction.ValidatePackage(interactionPkg); validator.HasErrors(findings) {
		return fmt.Errorf("interaction package has error-severity findings; run validate-interactions")
	}
	interactionObligations, findings := interaction.ElaborateInteractions(semanticPkg.CoreModel, resolved, interactionPkg)
	if validator.HasErrors(findings) {
		return fmt.Errorf("interaction elaboration has error-severity findings")
	}
	pbuiPkg, err := pbuimds.LoadPackage(ctx, s.PBUIRoot)
	if err != nil {
		return err
	}
	if findings := pbuimds.ValidatePackage(pbuiPkg, interactionPkg); validator.HasErrors(findings) {
		return fmt.Errorf("PBUI MetaDesignSystem has error-severity findings")
	}
	outputDir := s.OutputDir
	if outputDir == "" {
		outputDir = resolveScaffoldOutputDir(s.Root, pbuiPkg.ReactTarget.Defaults.OutputDir)
	}
	plan := pbuimds.BuildReactPlan(
		pbuiPkg,
		pbuiPkg.ReactTarget,
		pbuimds.Lower(interactionObligations, pbuiPkg),
		pbuimds.DeriveObjectTypeDescriptors(semanticPkg.CoreModel, resolved),
		pbuimds.DeriveActionDescriptors(interactionPkg),
		outputDir,
	)
	plan.Generated = genmeta.CurrentGeneratedInfo("dmeta scaffold-pbui-react")
	plan.SemanticRoot = s.Root
	plan.InteractionsRoot = s.InteractionsRoot
	plan.PBUIRoot = s.PBUIRoot
	rendered, err := pbuimds.RenderReactPlan(plan)
	if err != nil {
		return err
	}
	results, err := pbuimds.WriteReactFiles(rendered, pbuimds.WriteOptions{DryRun: s.DryRun, Force: s.Force, MetadataOnly: s.MetadataOnly})
	if err != nil {
		return err
	}
	for _, result := range results {
		row := types.NewRow(
			types.MRP("path", result.Path),
			types.MRP("kind", result.Kind),
			types.MRP("action", result.Action),
			types.MRP("bytes", result.Bytes),
		)
		if err := gp.AddRow(ctx, row); err != nil {
			return err
		}
	}
	return nil
}

func resolveScaffoldOutputDir(root string, outputDir string) string {
	if outputDir == "" || filepath.IsAbs(outputDir) {
		return outputDir
	}
	return filepath.Clean(filepath.Join(root, outputDir))
}
