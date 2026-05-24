package cmds

import (
	"context"
	"fmt"

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

type ValidatePBUICommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*ValidatePBUICommand)(nil)

type ValidatePBUISettings struct {
	PBUIRoot         string `glazed:"pbui-root"`
	InteractionsRoot string `glazed:"interactions-root"`
	Strict           bool   `glazed:"strict"`
	FailOnWarning    bool   `glazed:"fail-on-warning"`
	IncludeInfo      bool   `glazed:"include-info"`
}

func NewValidatePBUICommand() (*ValidatePBUICommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"validate-pbui",
		cmds.WithShort("Validate a PBUI/CLIM MetaDesignSystem package"),
		cmds.WithLong(`Validate a PBUI/CLIM MetaDesignSystem package.

The command loads the PBUI source package, loads the shared Interaction IR
package, and checks that PBUI presentation types and lowering rules reference
known concrete Interaction IR representations/actions. It also checks for the
natural-language intent fields that keep presentation-system IR understandable
instead of reducing it to terse ids.

Examples:
  dmeta validate-pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./sources/dmeta-ir --output table
  dmeta validate-pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./sources/dmeta-ir --include-info
`),
		cmds.WithFlags(
			fields.New(
				"pbui-root",
				fields.TypeString,
				fields.WithDefault("sources/dmeta-ir/meta-design-systems/pbui"),
				fields.WithHelp("Directory containing PBUI meta-design-system.yaml, presentation-types.yaml, lowering-rules.yaml, and targets/react.yaml"),
			),
			fields.New(
				"interactions-root",
				fields.TypeString,
				fields.WithDefault("sources/dmeta-ir"),
				fields.WithHelp("Directory containing interactions/ actions, representations, and elaboration rules"),
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

	return &ValidatePBUICommand{CommandDescription: desc}, nil
}

func (c *ValidatePBUICommand) RunIntoGlazeProcessor(ctx context.Context, vals *values.Values, gp middlewares.Processor) error {
	s := &ValidatePBUISettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode validate-pbui settings")
	}

	interactionPkg, err := interaction.LoadPackage(ctx, s.InteractionsRoot)
	if err != nil {
		return err
	}
	interactionFindings := interaction.ValidatePackage(interactionPkg)
	if validator.HasErrors(interactionFindings) {
		return fmt.Errorf("interaction package has error-severity findings; run validate-interactions")
	}

	pbuiPkg, err := pbuimds.LoadPackage(ctx, s.PBUIRoot)
	if err != nil {
		return err
	}
	findings := pbuimds.ValidatePackage(pbuiPkg, interactionPkg)
	if s.IncludeInfo && !validator.HasErrors(findings) {
		findings = append(findings, validator.Info("pbui_meta_design_system", "", "validation_ok", "DMETA PBUI MetaDesignSystem has no error-severity findings", ""))
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
		return fmt.Errorf("DMETA PBUI MetaDesignSystem validation failed")
	}
	return nil
}
