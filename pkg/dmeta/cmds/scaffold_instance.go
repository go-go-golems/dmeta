package cmds

import (
	"context"
	"path/filepath"

	widgetgen "github.com/go-go-golems/dmeta/pkg/dmeta/generator/widgets"
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

type ScaffoldInstanceCommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*ScaffoldInstanceCommand)(nil)

type ScaffoldInstanceSettings struct {
	Root     string `glazed:"root"`
	Instance string `glazed:"instance"`
	Out      string `glazed:"out"`
	Force    bool   `glazed:"force"`
	DryRun   bool   `glazed:"dry-run"`
}

func NewScaffoldInstanceCommand() (*ScaffoldInstanceCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"scaffold-instance",
		cmds.WithShort("Scaffold selected widget templates for a DMETA instance manifest"),
		cmds.WithLong(`Scaffold concrete widget files from a DMETA instance manifest.

The command loads the global widget-template package, then merges any local template
files declared by the instance manifest. It generates only selected_templates into
the instance output directory; excluded_templates remain documentation only.

Examples:
  dmeta scaffold-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --dry-run --output table
  dmeta scaffold-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --force --output table
`),
		cmds.WithFlags(
			fields.New(
				"root",
				fields.TypeString,
				fields.WithDefault(""),
				fields.WithHelp("Optional global DMETA IR root; when empty uses template_sources.global_ir_root from the instance manifest"),
			),
			fields.New(
				"instance",
				fields.TypeString,
				fields.WithHelp("Path to dmeta_instance YAML manifest"),
			),
			fields.New(
				"out",
				fields.TypeString,
				fields.WithDefault(""),
				fields.WithHelp("Optional output directory; when empty uses generation.output_dir from the instance manifest"),
			),
			fields.New(
				"force",
				fields.TypeBool,
				fields.WithDefault(false),
				fields.WithHelp("Overwrite existing generated scaffold files"),
			),
			fields.New(
				"dry-run",
				fields.TypeBool,
				fields.WithDefault(false),
				fields.WithHelp("Report planned writes without writing files"),
			),
		),
		cmds.WithSections(glazedSection, commandSettingsSection),
	)

	return &ScaffoldInstanceCommand{CommandDescription: desc}, nil
}

func (c *ScaffoldInstanceCommand) RunIntoGlazeProcessor(
	ctx context.Context,
	vals *values.Values,
	gp middlewares.Processor,
) error {
	s := &ScaffoldInstanceSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode scaffold-instance settings")
	}
	if s.Instance == "" {
		return errors.New("--instance is required")
	}

	instance, instanceDir, err := widgetgen.LoadInstance(s.Instance)
	if err != nil {
		return err
	}
	resolved, err := widgetgen.ResolveTemplates(ctx, s.Root, instanceDir, instance)
	if err != nil {
		return err
	}
	out := s.Out
	if out == "" {
		out = instance.Generation.OutputDir
	}
	if out != "" && !filepath.IsAbs(out) {
		out = filepath.Join(instanceDir, out)
	}
	files, err := widgetgen.Generate(instance, resolved, out)
	if err != nil {
		return err
	}
	results, err := widgetgen.WriteFiles(files, s.Force, s.DryRun)
	if err != nil {
		return errors.Wrap(err, "write instance widget scaffolds")
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
