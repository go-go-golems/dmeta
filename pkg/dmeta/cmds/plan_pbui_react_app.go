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

type PlanPBUIReactAppCommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*PlanPBUIReactAppCommand)(nil)

type PlanPBUIReactAppSettings struct {
	Root             string `glazed:"root"`
	InteractionsRoot string `glazed:"interactions-root"`
	PBUIRoot         string `glazed:"pbui-root"`
	ProfileRoot      string `glazed:"profile-root"`
	OutputDir        string `glazed:"output-dir"`
}

func NewPlanPBUIReactAppCommand() (*PlanPBUIReactAppCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"plan-pbui-react-app",
		cmds.WithShort("Plan a concrete PBUI/CLIM React app target"),
		cmds.WithLong(`Plan a concrete PBUI/CLIM React app target.

This command runs the Semantic IR -> Interaction IR -> PBUI lowering -> concrete
presentation profile instantiation chain and then plans the React application
files needed to realize that concrete profile. Unlike plan-pbui-react, this is
not a generic PBUI scaffold. It plans a concrete CLIM-style app shell, runtime
modules, CSS/font assets, view components, presentation components, generated
registry integration, and metadata for a promoted app such as Street Deli
www/clim-react.

Examples:
  dmeta plan-pbui-react-app --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --output table
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
				fields.WithDefault("sources/dmeta-ir"),
				fields.WithHelp("Directory containing interactions/ actions, representations, and elaboration rules"),
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
			fields.New(
				"output-dir",
				fields.TypeString,
				fields.WithDefault(""),
				fields.WithHelp("Override the React app output directory from targets/react-app.yaml"),
			),
		),
		cmds.WithSections(glazedSection, commandSettingsSection),
	)

	return &PlanPBUIReactAppCommand{CommandDescription: desc}, nil
}

func (c *PlanPBUIReactAppCommand) RunIntoGlazeProcessor(ctx context.Context, vals *values.Values, gp middlewares.Processor) error {
	s := &PlanPBUIReactAppSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode plan-pbui-react-app settings")
	}

	profilePkg, concretePlan, err := buildConcreteProfilePlan(ctx, s.Root, s.InteractionsRoot, s.PBUIRoot, s.ProfileRoot)
	if err != nil {
		return err
	}
	reactPlan := profile.BuildReactAppPlan(profilePkg, concretePlan, s.OutputDir)
	for _, file := range reactPlan.Files {
		row := types.NewRow(
			types.MRP("path", file.Path),
			types.MRP("kind", file.Kind),
			types.MRP("symbol", file.Symbol),
			types.MRP("view", file.ViewID),
			types.MRP("component", file.Component),
			types.MRP("presentation_type", file.PresentationTypeID),
			types.MRP("surface", file.SurfaceID),
			types.MRP("profile", reactPlan.ProfileID),
			types.MRP("style_profile", reactPlan.StyleProfileID),
			types.MRP("source", file.Provenance.Source),
		)
		if err := gp.AddRow(ctx, row); err != nil {
			return err
		}
	}
	return nil
}

func buildConcreteProfilePlan(ctx context.Context, root, interactionsRoot, pbuiRoot, profileRoot string) (*profile.Package, profile.ConcretePresentationPlan, error) {
	semanticPkg, err := validator.LoadPackage(ctx, root)
	if err != nil {
		return nil, profile.ConcretePresentationPlan{}, err
	}
	resolved, inheritanceFindings := validator.ResolveCoreInheritance(semanticPkg.CoreModel)
	if validator.HasErrors(inheritanceFindings) {
		return nil, profile.ConcretePresentationPlan{}, fmt.Errorf("semantic inheritance has error-severity findings; run validate-ir")
	}

	interactionPkg, err := interaction.LoadPackage(ctx, interactionsRoot)
	if err != nil {
		return nil, profile.ConcretePresentationPlan{}, err
	}
	interactionFindings := interaction.ValidatePackage(interactionPkg)
	if validator.HasErrors(interactionFindings) {
		return nil, profile.ConcretePresentationPlan{}, fmt.Errorf("interaction package has error-severity findings; run validate-interactions")
	}

	interactionObligations, elaborationFindings := interaction.ElaborateInteractions(semanticPkg.CoreModel, resolved, interactionPkg)
	if validator.HasErrors(elaborationFindings) {
		return nil, profile.ConcretePresentationPlan{}, fmt.Errorf("interaction elaboration has error-severity findings")
	}

	pbuiPkg, err := pbuimds.LoadPackage(ctx, pbuiRoot)
	if err != nil {
		return nil, profile.ConcretePresentationPlan{}, err
	}
	pbuiFindings := pbuimds.ValidatePackage(pbuiPkg, interactionPkg)
	if validator.HasErrors(pbuiFindings) {
		return nil, profile.ConcretePresentationPlan{}, fmt.Errorf("PBUI MetaDesignSystem has error-severity findings; run validate-pbui")
	}

	profilePkg, err := profile.LoadPackage(ctx, profileRoot)
	if err != nil {
		return nil, profile.ConcretePresentationPlan{}, err
	}
	profileFindings := profile.ValidatePackage(profilePkg, pbuiPkg)
	if validator.HasErrors(profileFindings) {
		return nil, profile.ConcretePresentationPlan{}, fmt.Errorf("PBUI presentation profile has error-severity findings; run validate-pbui-profile")
	}

	pbuiObligations := pbuimds.Lower(interactionObligations, pbuiPkg)
	return profilePkg, profile.InstantiateProfile(profilePkg, pbuiObligations), nil
}
