package cmds

import (
	"context"
	"fmt"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
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

type ValidateInteractionsCommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*ValidateInteractionsCommand)(nil)

type ValidateInteractionsSettings struct {
	Root          string `glazed:"root"`
	Strict        bool   `glazed:"strict"`
	FailOnWarning bool   `glazed:"fail-on-warning"`
	IncludeInfo   bool   `glazed:"include-info"`
}

func NewValidateInteractionsCommand() (*ValidateInteractionsCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"validate-interactions",
		cmds.WithShort("Validate DMETA Interaction IR YAML files"),
		cmds.WithLong(`Validate the DMETA Interaction IR package.

The command loads interactions/00-index.yaml, actions.yaml,
representations.yaml, and elaboration-rules.yaml from the provided root,
checks roots, inheritance references, cycles, representation/action
references, and elaboration rule emissions.

Examples:
  dmeta validate-interactions --root ./sources/dmeta-ir --output table
  dmeta validate-interactions --root ./sources/dmeta-ir --include-info
`),
		cmds.WithFlags(
			fields.New(
				"root",
				fields.TypeString,
				fields.WithDefault("sources/dmeta-ir"),
				fields.WithHelp("Directory containing the DMETA IR package with an interactions/ subdirectory"),
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

	return &ValidateInteractionsCommand{CommandDescription: desc}, nil
}

func (c *ValidateInteractionsCommand) RunIntoGlazeProcessor(ctx context.Context, vals *values.Values, gp middlewares.Processor) error {
	s := &ValidateInteractionsSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode validate-interactions settings")
	}

	pkg, err := interaction.LoadPackage(ctx, s.Root)
	if err != nil {
		return err
	}
	findings := interaction.ValidatePackage(pkg)
	if s.IncludeInfo && !validator.HasErrors(findings) {
		findings = append(findings, validator.Info("interactions", "", "validation_ok", "DMETA Interaction IR has no error-severity findings", ""))
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
		return fmt.Errorf("DMETA Interaction IR validation failed")
	}
	return nil
}
