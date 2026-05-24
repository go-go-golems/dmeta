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

type ElaborateInteractionsCommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*ElaborateInteractionsCommand)(nil)

type ElaborateInteractionsSettings struct {
	Root             string `glazed:"root"`
	InteractionsRoot string `glazed:"interactions-root"`
}

func NewElaborateInteractionsCommand() (*ElaborateInteractionsCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"elaborate-interactions",
		cmds.WithShort("Derive modality-neutral interaction obligations from DMETA semantic mappings"),
		cmds.WithLong(`Elaborate semantic archetype/capability mappings into Interaction IR obligations.

The command loads a semantic DMETA package from --root, loads the shared
action/representation/rule catalog from --interactions-root, then emits rows for
representations and actions implied by domain type facts.

Examples:
  dmeta elaborate-interactions --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --output table
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
		),
		cmds.WithSections(glazedSection, commandSettingsSection),
	)

	return &ElaborateInteractionsCommand{CommandDescription: desc}, nil
}

func (c *ElaborateInteractionsCommand) RunIntoGlazeProcessor(ctx context.Context, vals *values.Values, gp middlewares.Processor) error {
	s := &ElaborateInteractionsSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode elaborate-interactions settings")
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

	obligations, findings := interaction.ElaborateInteractions(semanticPkg.CoreModel, resolved, interactionPkg)
	if validator.HasErrors(findings) {
		return fmt.Errorf("interaction elaboration has error-severity findings")
	}

	for _, obligation := range obligations {
		row := types.NewRow(
			types.MRP("example", obligation.ExampleID),
			types.MRP("domain_type", obligation.DomainTypeID),
			types.MRP("kind", obligation.Kind),
			types.MRP("id", obligation.ID),
			types.MRP("source_rule", obligation.SourceRuleID),
			types.MRP("summary", obligation.SourceSummary),
		)
		if err := gp.AddRow(ctx, row); err != nil {
			return err
		}
	}
	return nil
}
