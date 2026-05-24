package cmds

import (
	"context"
	"fmt"
	"strings"

	"github.com/go-go-golems/dmeta/pkg/dmeta/interaction"
	webmds "github.com/go-go-golems/dmeta/pkg/dmeta/metadesign/web"
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

type LowerWebCommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*LowerWebCommand)(nil)

type LowerWebSettings struct {
	Root             string `glazed:"root"`
	InteractionsRoot string `glazed:"interactions-root"`
	WebRoot          string `glazed:"web-root"`
}

func NewLowerWebCommand() (*LowerWebCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"lower-web",
		cmds.WithShort("Lower Interaction IR obligations into Web MetaDesignSystem obligations"),
		cmds.WithLong(`Lower semantic interaction obligations into Web widget obligations.

The command loads a semantic DMETA package, elaborates Interaction IR obligations,
loads a Web MetaDesignSystem package, then applies Web lowering rules to emit
widget-template, slot, visual-state, and event-binding obligations. It does not
emit React components; React remains a later target pass under Web.

Examples:
  dmeta lower-web --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --web-root ./examples/street-deli-ordering/meta-design-systems/web --output table
`),
		cmds.WithFlags(
			fields.New(
				"root",
				fields.TypeString,
				fields.WithDefault("sources/dmeta-ir"),
				fields.WithHelp("Directory containing the semantic DMETA IR package to elaborate"),
			),
			fields.New(
				"interactions-root",
				fields.TypeString,
				fields.WithDefault("sources/dmeta-ir"),
				fields.WithHelp("Directory containing interactions/ actions, representations, and elaboration rules"),
			),
			fields.New(
				"web-root",
				fields.TypeString,
				fields.WithDefault("sources/dmeta-ir/meta-design-systems/web"),
				fields.WithHelp("Directory containing a Web MetaDesignSystem package"),
			),
		),
		cmds.WithSections(glazedSection, commandSettingsSection),
	)

	return &LowerWebCommand{CommandDescription: desc}, nil
}

func (c *LowerWebCommand) RunIntoGlazeProcessor(ctx context.Context, vals *values.Values, gp middlewares.Processor) error {
	s := &LowerWebSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode lower-web settings")
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

	webPkg, err := webmds.LoadPackage(ctx, s.WebRoot)
	if err != nil {
		return err
	}
	webFindings := webmds.ValidatePackage(webPkg, interactionPkg)
	if validator.HasErrors(webFindings) {
		return fmt.Errorf("Web MetaDesignSystem has error-severity findings")
	}

	webObligations := webmds.Lower(interactionObligations, webPkg)
	for _, obligation := range webObligations {
		row := types.NewRow(
			types.MRP("example", obligation.ExampleID),
			types.MRP("domain_type", obligation.DomainTypeID),
			types.MRP("widget_template", obligation.WidgetTemplateID),
			types.MRP("source_rule", obligation.SourceRuleID),
			types.MRP("source_representations", strings.Join(obligation.SourceRepresentations, ",")),
			types.MRP("source_actions", strings.Join(obligation.SourceActions, ",")),
			types.MRP("slots", strings.Join(obligation.Slots, ",")),
			types.MRP("visual_states", strings.Join(obligation.VisualStates, ",")),
			types.MRP("event_bindings", strings.Join(obligation.EventBindings, ",")),
			types.MRP("description", obligation.Description),
		)
		if err := gp.AddRow(ctx, row); err != nil {
			return err
		}
	}
	return nil
}
