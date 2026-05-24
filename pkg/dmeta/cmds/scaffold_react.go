package cmds

import (
	"context"

	reactgen "github.com/go-go-golems/dmeta/pkg/dmeta/generator/react"
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

type ScaffoldReactCommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*ScaffoldReactCommand)(nil)

type ScaffoldReactSettings struct {
	Instance         string `glazed:"instance"`
	TargetFile       string `glazed:"target-file"`
	InteractionsRoot string `glazed:"interactions-root"`
	WebRoot          string `glazed:"web-root"`
	SemanticRoot     string `glazed:"semantic-root"`
	OutputDir        string `glazed:"output-dir"`
	Force            bool   `glazed:"force"`
	DryRun           bool   `glazed:"dry-run"`
	MetadataOnly     bool   `glazed:"metadata-only"`
}

func NewScaffoldReactCommand() (*ScaffoldReactCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"scaffold-react",
		cmds.WithShort("Render React target scaffolds from Web MetaDesignSystem obligations"),
		cmds.WithLong(`Render React target scaffold files from Web MetaDesignSystem obligations.

The command follows the new compiler path: Semantic IR -> Interaction IR -> Web
MetaDesignSystem obligations -> React target plan -> rendered React files. It does
not call the legacy generic widget renderer. Use --dry-run to inspect planned writes
without touching the filesystem.

Examples:
  dmeta scaffold-react --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --dry-run --output table
  dmeta scaffold-react --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --metadata-only --dry-run --output table
`),
		cmds.WithFlags(
			fields.New("instance", fields.TypeString, fields.WithHelp("Path to dmeta_instance YAML manifest")),
			fields.New("target-file", fields.TypeString, fields.WithDefault(""), fields.WithHelp("Optional React target YAML file; defaults to <interactions-root>/meta-design-systems/web/targets/react.yaml")),
			fields.New("interactions-root", fields.TypeString, fields.WithDefault(""), fields.WithHelp("Optional root containing interactions/ and the React target file; defaults to instance interactions_root")),
			fields.New("web-root", fields.TypeString, fields.WithDefault(""), fields.WithHelp("Optional Web MetaDesignSystem root; defaults to <semantic-root>/meta-design-systems/web")),
			fields.New("semantic-root", fields.TypeString, fields.WithDefault(""), fields.WithHelp("Optional semantic DMETA package root; defaults to instance_root or core_model_root from the manifest")),
			fields.New("output-dir", fields.TypeString, fields.WithDefault(""), fields.WithHelp("Optional output directory override")),
			fields.New("force", fields.TypeBool, fields.WithDefault(false), fields.WithHelp("Overwrite existing React scaffold files")),
			fields.New("dry-run", fields.TypeBool, fields.WithDefault(false), fields.WithHelp("Report planned writes without writing files")),
			fields.New("metadata-only", fields.TypeBool, fields.WithDefault(false), fields.WithHelp("Render only metadata sidecar files")),
		),
		cmds.WithSections(glazedSection, commandSettingsSection),
	)

	return &ScaffoldReactCommand{CommandDescription: desc}, nil
}

func (c *ScaffoldReactCommand) RunIntoGlazeProcessor(ctx context.Context, vals *values.Values, gp middlewares.Processor) error {
	s := &ScaffoldReactSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode scaffold-react settings")
	}
	if s.Instance == "" {
		return errors.New("--instance is required")
	}
	plan, err := reactgen.BuildScaffoldPlan(ctx, reactgen.PlanOptions{
		InstancePath:     s.Instance,
		TargetFile:       s.TargetFile,
		InteractionsRoot: s.InteractionsRoot,
		WebRoot:          s.WebRoot,
		SemanticRoot:     s.SemanticRoot,
		OutputDir:        s.OutputDir,
	})
	if err != nil {
		return err
	}
	var files []reactgen.GeneratedFile
	if s.MetadataOnly {
		files, err = reactgen.GenerateMetadataSidecars(plan)
	} else {
		files, err = reactgen.Generate(plan)
	}
	if err != nil {
		return err
	}
	results, err := reactgen.WriteFiles(files, s.Force, s.DryRun)
	if err != nil {
		return errors.Wrap(err, "write React scaffolds")
	}
	for _, result := range results {
		row := types.NewRow(
			types.MRP("file", result.File),
			types.MRP("status", result.Status),
			types.MRP("bytes", result.Bytes),
			types.MRP("reason", result.Reason),
		)
		if err := gp.AddRow(ctx, row); err != nil {
			return err
		}
	}
	return nil
}
