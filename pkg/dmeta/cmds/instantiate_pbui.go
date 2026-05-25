package cmds

import (
	"context"
	"fmt"
	"strings"

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

type InstantiatePBUICommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*InstantiatePBUICommand)(nil)

type InstantiatePBUISettings struct {
	Root             string `glazed:"root"`
	InteractionsRoot string `glazed:"interactions-root"`
	PBUIRoot         string `glazed:"pbui-root"`
	ProfileRoot      string `glazed:"profile-root"`
}

func NewInstantiatePBUICommand() (*InstantiatePBUICommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"instantiate-pbui",
		cmds.WithShort("Instantiate PBUI obligations with a concrete presentation profile"),
		cmds.WithLong(`Instantiate abstract PBUI obligations with a concrete presentation profile.

The command loads Semantic IR, elaborates Interaction IR obligations, lowers them
into abstract PBUI presentation obligations, loads a concrete presentation
profile such as Street Deli CLIM, and emits a target-neutral concrete
presentation plan. This plan is the missing layer between generic PBUI lowering
and React app planning: it records views, surfaces, renderer components, domain
types, actions, representations, presenter intent, recognizer intent, and style
profile.

Examples:
  dmeta instantiate-pbui --root ./examples/street-deli-ordering --interactions-root ./examples/street-deli-ordering --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --output table
`),
		cmds.WithFlags(
			fields.New(
				"root",
				fields.TypeString,
				fields.WithDefault("examples/street-deli-ordering"),
				fields.WithHelp("Directory containing the semantic DMETA IR package to elaborate"),
			),
			fields.New(
				"interactions-root",
				fields.TypeString,
				fields.WithDefault("examples/street-deli-ordering"),
				fields.WithHelp("Directory containing the effective interaction package used by this profile"),
			),
			fields.New(
				"pbui-root",
				fields.TypeString,
				fields.WithDefault("sources/dmeta-ir/meta-design-systems/pbui"),
				fields.WithHelp("Directory containing a PBUI MetaDesignSystem package"),
			),
			fields.New(
				"profile-root",
				fields.TypeString,
				fields.WithDefault("examples/street-deli-ordering/meta-design-systems/pbui"),
				fields.WithHelp("Directory containing the concrete PBUI presentation-system profile"),
			),
		),
		cmds.WithSections(glazedSection, commandSettingsSection),
	)

	return &InstantiatePBUICommand{CommandDescription: desc}, nil
}

func (c *InstantiatePBUICommand) RunIntoGlazeProcessor(ctx context.Context, vals *values.Values, gp middlewares.Processor) error {
	s := &InstantiatePBUISettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode instantiate-pbui settings")
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
		return fmt.Errorf("PBUI MetaDesignSystem has error-severity findings; run validate-pbui")
	}

	profilePkg, err := profile.LoadPackage(ctx, s.ProfileRoot)
	if err != nil {
		return err
	}
	profileFindings := profile.ValidatePackage(profilePkg, pbuiPkg, interactionPkg)
	if validator.HasErrors(profileFindings) {
		return fmt.Errorf("PBUI presentation profile has error-severity findings; run validate-pbui-profile")
	}

	pbuiObligations := pbuimds.Lower(interactionObligations, pbuiPkg)
	plan := profile.InstantiateProfile(profilePkg, pbuiObligations)
	for _, view := range plan.Views {
		for _, presentation := range view.Presentations {
			row := types.NewRow(
				types.MRP("view", presentation.ViewID),
				types.MRP("mode", presentation.ModeLabel),
				types.MRP("surface", presentation.SurfaceID),
				types.MRP("surface_component", presentation.SurfaceComponent),
				types.MRP("presentation_type", presentation.PresentationTypeID),
				types.MRP("component", presentation.Component),
				types.MRP("domain_types", strings.Join(presentation.DomainTypes, ",")),
				types.MRP("actions", strings.Join(presentation.SourceActions, ",")),
				types.MRP("representations", strings.Join(presentation.SourceRepresentations, ",")),
				types.MRP("source_rules", strings.Join(presentation.SourceRules, ",")),
				types.MRP("presenter_intent", oneLineIntent(presentation.PresenterIntent)),
				types.MRP("recognizer_intent", oneLineIntent(presentation.RecognizerIntent)),
				types.MRP("style_profile", presentation.StyleProfileID),
			)
			if err := gp.AddRow(ctx, row); err != nil {
				return err
			}
		}
	}
	return nil
}

func oneLineIntent(value string) string {
	return strings.Join(strings.Fields(value), " ")
}
