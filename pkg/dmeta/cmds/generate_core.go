package cmds

import (
	"context"
	"fmt"

	coregen "github.com/go-go-golems/dmeta/pkg/dmeta/generator/core"
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

type GenerateCoreCommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*GenerateCoreCommand)(nil)

type GenerateCoreSettings struct {
	Root         string `glazed:"root"`
	Out          string `glazed:"out"`
	Force        bool   `glazed:"force"`
	DryRun       bool   `glazed:"dry-run"`
	SkipValidate bool   `glazed:"skip-validate"`
}

func NewGenerateCoreCommand() (*GenerateCoreCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"generate-core",
		cmds.WithShort("Generate TypeScript core registries from DMETA v0 IR"),
		cmds.WithLong(`Generate TypeScript core registry files from the validated DMETA v0 IR.

The command loads the split core-model package under --root, validates it by default,
and renders TypeScript metadata/types/helpers for archetypes, capabilities,
presentations, actions, PresentationRef, and action matching.

Examples:
  dmeta generate-core --root ./sources/dmeta-ir --out ./generated/dmeta-core --dry-run --output table
  dmeta generate-core --root ./sources/dmeta-ir --out ./generated/dmeta-core --force --output table
`),
		cmds.WithFlags(
			fields.New(
				"root",
				fields.TypeString,
				fields.WithDefault("sources/dmeta-ir"),
				fields.WithHelp("Directory containing the DMETA IR YAML files"),
			),
			fields.New(
				"out",
				fields.TypeString,
				fields.WithDefault("generated/dmeta-core"),
				fields.WithHelp("Output directory for generated TypeScript core registry files"),
			),
			fields.New(
				"force",
				fields.TypeBool,
				fields.WithDefault(false),
				fields.WithHelp("Overwrite existing generated files"),
			),
			fields.New(
				"dry-run",
				fields.TypeBool,
				fields.WithDefault(false),
				fields.WithHelp("Validate and report planned writes without writing files"),
			),
			fields.New(
				"skip-validate",
				fields.TypeBool,
				fields.WithDefault(false),
				fields.WithHelp("Skip pre-generation validation"),
			),
		),
		cmds.WithSections(glazedSection, commandSettingsSection),
	)

	return &GenerateCoreCommand{CommandDescription: desc}, nil
}

func (c *GenerateCoreCommand) RunIntoGlazeProcessor(
	ctx context.Context,
	vals *values.Values,
	gp middlewares.Processor,
) error {
	s := &GenerateCoreSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode generate-core settings")
	}

	if !s.SkipValidate {
		findings, err := validator.ValidateRoot(ctx, s.Root, false)
		if err != nil {
			return err
		}
		if validator.HasErrors(findings) {
			return fmt.Errorf("DMETA IR validation failed; run validate-ir for details")
		}
	}

	pkg, err := validator.LoadPackage(ctx, s.Root)
	if err != nil {
		return errors.Wrap(err, "load DMETA IR package")
	}
	files, err := coregen.Generate(pkg, s.Out)
	if err != nil {
		return errors.Wrap(err, "generate TypeScript core registries")
	}
	results, err := coregen.WriteFiles(files, s.Force, s.DryRun)
	if err != nil {
		return errors.Wrap(err, "write generated TypeScript core registries")
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
