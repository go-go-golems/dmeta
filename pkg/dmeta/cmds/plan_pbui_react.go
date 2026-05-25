package cmds

import (
	"context"
	"fmt"
	"path/filepath"
	"strings"

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

type PlanPBUIReactCommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*PlanPBUIReactCommand)(nil)

type PlanPBUIReactSettings struct {
	Root             string `glazed:"root"`
	InteractionsRoot string `glazed:"interactions-root"`
	PBUIRoot         string `glazed:"pbui-root"`
	OutputDir        string `glazed:"output-dir"`
}

func NewPlanPBUIReactCommand() (*PlanPBUIReactCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"plan-pbui-react",
		cmds.WithShort("Plan React target files from PBUI presentation obligations"),
		cmds.WithLong(`Plan PBUI React target files without rendering them.

The command derives object descriptors from Semantic IR, action descriptors from
Interaction IR, lowers Interaction IR obligations into PBUI presentation
obligations, and then plans React target files such as registries, session
state, selectors, presenter hooks, event adapters, components, stories, and
metadata sidecars. Rows preserve provenance and intent so the plan can be used
as a design review artifact before rescaffolding Street Deli.

Examples:
  dmeta plan-pbui-react --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --output table
`),
		cmds.WithFlags(
			fields.New("root", fields.TypeString, fields.WithDefault("sources/dmeta-ir"), fields.WithHelp("Directory containing the semantic DMETA IR package to elaborate")),
			fields.New("interactions-root", fields.TypeString, fields.WithDefault("sources/dmeta-ir"), fields.WithHelp("Directory containing interactions/ actions, representations, and elaboration rules")),
			fields.New("pbui-root", fields.TypeString, fields.WithDefault("sources/dmeta-ir/meta-design-systems/pbui"), fields.WithHelp("Directory containing a PBUI MetaDesignSystem package")),
			fields.New("output-dir", fields.TypeString, fields.WithDefault(""), fields.WithHelp("Optional output directory for planned PBUI React files")),
		),
		cmds.WithSections(glazedSection, commandSettingsSection),
	)
	return &PlanPBUIReactCommand{CommandDescription: desc}, nil
}

func (c *PlanPBUIReactCommand) RunIntoGlazeProcessor(ctx context.Context, vals *values.Values, gp middlewares.Processor) error {
	s := &PlanPBUIReactSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode plan-pbui-react settings")
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
	interactionFindings := interaction.ValidatePackage(interactionPkg)
	if validator.HasErrors(interactionFindings) {
		return fmt.Errorf("interaction package has error-severity findings; run validate-interactions")
	}
	interactionObligations, elaborationFindings := interaction.ElaborateInteractions(semanticPkg.CoreModel, resolved, interactionPkg)
	if validator.HasErrors(elaborationFindings) {
		return fmt.Errorf("interaction elaboration has error-severity findings")
	}

	pbuiPkg, err := pbuimds.LoadPackage(ctx, s.PBUIRoot)
	if err != nil {
		return err
	}
	pbuiFindings := pbuimds.ValidatePackage(pbuiPkg, interactionPkg)
	if validator.HasErrors(pbuiFindings) {
		return fmt.Errorf("PBUI MetaDesignSystem has error-severity findings")
	}

	pbuiObligations := pbuimds.Lower(interactionObligations, pbuiPkg)
	objectDescriptors := pbuimds.DeriveObjectTypeDescriptors(semanticPkg.CoreModel, resolved)
	actionDescriptors := pbuimds.DeriveActionDescriptors(interactionPkg)
	outputDir := s.OutputDir
	if outputDir == "" {
		outputDir = resolvePlanOutputDir(s.Root, pbuiPkg.ReactTarget.Defaults.OutputDir)
	}
	plan := pbuimds.BuildReactPlan(pbuiPkg, pbuiPkg.ReactTarget, pbuiObligations, objectDescriptors, actionDescriptors, outputDir)
	plan.Generated = genmeta.CurrentGeneratedInfo("dmeta plan-pbui-react")
	plan.SemanticRoot = s.Root
	plan.InteractionsRoot = s.InteractionsRoot
	plan.PBUIRoot = s.PBUIRoot

	for _, file := range plan.Files {
		row := types.NewRow(
			types.MRP("path", file.Path),
			types.MRP("kind", file.Kind),
			types.MRP("symbol", file.Symbol),
			types.MRP("presentation_type", file.Provenance.PresentationTypeID),
			types.MRP("domain_types", strings.Join(file.Provenance.DomainTypes, ",")),
			types.MRP("representations", strings.Join(file.Provenance.Representations, ",")),
			types.MRP("actions", strings.Join(file.Provenance.Actions, ",")),
			types.MRP("source_rules", strings.Join(file.Provenance.SourceRules, ",")),
			types.MRP("presenter_intent", file.Provenance.PresenterIntent),
			types.MRP("recognizer_intent", file.Provenance.RecognizerIntent),
			types.MRP("rationale", file.Provenance.LoweringRationale),
		)
		if err := gp.AddRow(ctx, row); err != nil {
			return err
		}
	}
	return nil
}

func resolvePlanOutputDir(root string, outputDir string) string {
	if outputDir == "" || filepath.IsAbs(outputDir) {
		return outputDir
	}
	return filepath.Clean(filepath.Join(root, outputDir))
}
