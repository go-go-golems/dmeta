package cmds

import (
	"context"
	"fmt"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
	pbuimds "github.com/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui"
	"github.com/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile"
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

type ValidatePBUIProfileCommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*ValidatePBUIProfileCommand)(nil)

type ValidatePBUIProfileSettings struct {
	ProfileRoot      string `glazed:"profile-root"`
	PBUIRoot         string `glazed:"pbui-root"`
	InteractionsRoot string `glazed:"interactions-root"`
	Strict           bool   `glazed:"strict"`
	FailOnWarning    bool   `glazed:"fail-on-warning"`
	IncludeInfo      bool   `glazed:"include-info"`
}

func NewValidatePBUIProfileCommand() (*ValidatePBUIProfileCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"validate-pbui-profile",
		cmds.WithShort("Validate a concrete PBUI presentation-system profile package"),
		cmds.WithLong(`Validate a concrete PBUI presentation-system profile package.

The command loads the shared Interaction IR package, the abstract PBUI
MetaDesignSystem package, and one concrete presentation profile package such as
the Street Deli CLIM profile. It checks that concrete views and renderer
bindings reference known PBUI presentation types, that concrete surfaces and
style classes are present, and that the React app target describes the CLIM
runtime states needed by the profile pass.

Examples:
  dmeta validate-pbui-profile --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./sources/dmeta-ir --output table
  dmeta validate-pbui-profile --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --include-info
`),
		cmds.WithFlags(
			fields.New(
				"profile-root",
				fields.TypeString,
				fields.WithDefault("examples/street-deli-ordering/meta-design-systems/pbui"),
				fields.WithHelp("Directory containing presentation-system.yaml and the concrete PBUI profile catalogs"),
			),
			fields.New(
				"pbui-root",
				fields.TypeString,
				fields.WithDefault("sources/dmeta-ir/meta-design-systems/pbui"),
				fields.WithHelp("Directory containing the abstract PBUI MetaDesignSystem package"),
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

	return &ValidatePBUIProfileCommand{CommandDescription: desc}, nil
}

func (c *ValidatePBUIProfileCommand) RunIntoGlazeProcessor(ctx context.Context, vals *values.Values, gp middlewares.Processor) error {
	s := &ValidatePBUIProfileSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode validate-pbui-profile settings")
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
	pbuiFindings := pbuimds.ValidatePackage(pbuiPkg, interactionPkg)
	if validator.HasErrors(pbuiFindings) {
		return fmt.Errorf("PBUI MetaDesignSystem has error-severity findings; run validate-pbui")
	}

	profilePkg, err := profile.LoadPackage(ctx, s.ProfileRoot)
	if err != nil {
		return err
	}
	findings := profile.ValidatePackage(profilePkg, pbuiPkg)
	if s.IncludeInfo && !validator.HasErrors(findings) {
		findings = append(findings, validator.Info("pbui_presentation_profile", "", "validation_ok", "DMETA PBUI presentation profile has no error-severity findings", ""))
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
		return fmt.Errorf("DMETA PBUI presentation profile validation failed")
	}
	return nil
}
