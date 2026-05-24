package cmds

import (
	"context"
	"fmt"
	"strings"

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

type LowerPBUICommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*LowerPBUICommand)(nil)

type LowerPBUISettings struct {
	Root             string `glazed:"root"`
	InteractionsRoot string `glazed:"interactions-root"`
	PBUIRoot         string `glazed:"pbui-root"`
}

func NewLowerPBUICommand() (*LowerPBUICommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"lower-pbui",
		cmds.WithShort("Lower Interaction IR obligations into PBUI presentation obligations"),
		cmds.WithLong(`Lower semantic interaction obligations into PBUI presentation obligations.

The command loads a semantic DMETA package, elaborates Interaction IR actions
and representations, loads a PBUI/CLIM MetaDesignSystem package, then applies
PBUI lowering rules. Output rows intentionally include natural-language
rationale, presenter intent, and recognizer intent so downstream target planning
and generated metadata remain understandable.

Examples:
  dmeta lower-pbui --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --output table
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
				"pbui-root",
				fields.TypeString,
				fields.WithDefault("sources/dmeta-ir/meta-design-systems/pbui"),
				fields.WithHelp("Directory containing a PBUI MetaDesignSystem package"),
			),
		),
		cmds.WithSections(glazedSection, commandSettingsSection),
	)

	return &LowerPBUICommand{CommandDescription: desc}, nil
}

func (c *LowerPBUICommand) RunIntoGlazeProcessor(ctx context.Context, vals *values.Values, gp middlewares.Processor) error {
	s := &LowerPBUISettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode lower-pbui settings")
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
	for _, obligation := range pbuiObligations {
		row := types.NewRow(
			types.MRP("example", obligation.ExampleID),
			types.MRP("domain_type", obligation.DomainTypeID),
			types.MRP("presentation_type", obligation.PresentationTypeID),
			types.MRP("source_rule", obligation.SourceRuleID),
			types.MRP("source_representations", strings.Join(obligation.SourceRepresentations, ",")),
			types.MRP("source_actions", strings.Join(obligation.SourceActions, ",")),
			types.MRP("description", obligation.Description),
			types.MRP("rationale", obligation.Rationale),
			types.MRP("presenter_intent", obligation.PresenterIntent),
			types.MRP("recognizer_intent", obligation.RecognizerIntent),
		)
		if err := gp.AddRow(ctx, row); err != nil {
			return err
		}
	}
	return nil
}
