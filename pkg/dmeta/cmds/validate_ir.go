package cmds

import (
	"context"
	"fmt"

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

type ValidateIRCommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*ValidateIRCommand)(nil)

type ValidateIRSettings struct {
	Root          string `glazed:"root"`
	Strict        bool   `glazed:"strict"`
	FailOnWarning bool   `glazed:"fail-on-warning"`
	IncludeInfo   bool   `glazed:"include-info"`
}

func NewValidateIRCommand() (*ValidateIRCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"validate-ir",
		cmds.WithShort("Validate DMETA v0 IR YAML files"),
		cmds.WithLong(`Validate the DMETA v0 IR package.

The command loads 00-index.yaml, 01-core-model.yaml, 02-design-language.yaml,
and the Web MetaDesignSystem package from the provided root directory, checks
artifact identity and cross-references, and emits structured validation finding rows.

Examples:
  dmeta validate-ir --root ./sources/dmeta-ir --output table
  dmeta validate-ir --root ./sources/dmeta-ir --output json
  dmeta validate-ir --root ./sources/dmeta-ir --include-info
`),
		cmds.WithFlags(
			fields.New(
				"root",
				fields.TypeString,
				fields.WithDefault("sources/dmeta-ir"),
				fields.WithHelp("Directory containing the DMETA IR YAML files"),
			),
			fields.New(
				"strict",
				fields.TypeBool,
				fields.WithDefault(false),
				fields.WithHelp("Treat warnings as failing findings"),
			),
			fields.New(
				"fail-on-warning",
				fields.TypeBool,
				fields.WithDefault(false),
				fields.WithHelp("Fail when warning findings are present"),
			),
			fields.New(
				"include-info",
				fields.TypeBool,
				fields.WithDefault(false),
				fields.WithHelp("Emit informational findings such as a validation_ok row"),
			),
		),
		cmds.WithSections(glazedSection, commandSettingsSection),
	)

	return &ValidateIRCommand{CommandDescription: desc}, nil
}

func (c *ValidateIRCommand) RunIntoGlazeProcessor(
	ctx context.Context,
	vals *values.Values,
	gp middlewares.Processor,
) error {
	s := &ValidateIRSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode validate-ir settings")
	}

	findings, err := validator.ValidateRoot(ctx, s.Root, s.IncludeInfo)
	if err != nil {
		return err
	}

	for _, finding := range findings {
		row := types.NewRow(
			types.MRP("severity", finding.Severity),
			types.MRP("code", finding.Code),
			types.MRP("artifact", finding.Artifact),
			types.MRP("path", finding.Path),
			types.MRP("message", finding.Message),
			types.MRP("hint", finding.Hint),
		)
		if err := gp.AddRow(ctx, row); err != nil {
			return err
		}
	}

	if validator.ShouldFail(findings, s.Strict || s.FailOnWarning) {
		return fmt.Errorf("DMETA IR validation failed")
	}

	return nil
}
