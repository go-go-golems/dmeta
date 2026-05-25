package cmds

import (
	"context"
	"path/filepath"

	genmeta "github.com/go-go-golems/dmeta/pkg/dmeta/generator/metadata"
	"github.com/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile"
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

type ScaffoldPBUIReactAppCommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*ScaffoldPBUIReactAppCommand)(nil)

type ScaffoldPBUIReactAppSettings struct {
	Root             string `glazed:"root"`
	InteractionsRoot string `glazed:"interactions-root"`
	PBUIRoot         string `glazed:"pbui-root"`
	ProfileRoot      string `glazed:"profile-root"`
	OutputDir        string `glazed:"output-dir"`
	DryRun           bool   `glazed:"dry-run"`
	Force            bool   `glazed:"force"`
}

func NewScaffoldPBUIReactAppCommand() (*ScaffoldPBUIReactAppCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"scaffold-pbui-react-app",
		cmds.WithShort("Scaffold a concrete PBUI/CLIM React app with Storybook"),
		cmds.WithLong(`Scaffold a concrete PBUI/CLIM React app with Storybook.

This command consumes the same concrete profile plan as plan-pbui-react-app and
writes a buildable Vite React application. The generated app includes the CLIM
shell, runtime placeholder modules, presentation components, view components,
Berkeley Mono font assets, CLIM CSS, deterministic fixtures, Storybook config,
and generated stories for shell, command, presentation, and view components.

Examples:
  dmeta scaffold-pbui-react-app --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --dry-run --output table
  dmeta scaffold-pbui-react-app --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --force
`),
		cmds.WithFlags(
			fields.New("root", fields.TypeString, fields.WithDefault("examples/street-deli-ordering"), fields.WithHelp("Directory containing the semantic DMETA IR package to elaborate")),
			fields.New("interactions-root", fields.TypeString, fields.WithDefault("sources/dmeta-ir"), fields.WithHelp("Directory containing interactions/ actions, representations, and elaboration rules")),
			fields.New("pbui-root", fields.TypeString, fields.WithDefault("sources/dmeta-ir/meta-design-systems/pbui"), fields.WithHelp("Directory containing a PBUI MetaDesignSystem package")),
			fields.New("profile-root", fields.TypeString, fields.WithDefault("examples/street-deli-ordering/meta-design-systems/pbui"), fields.WithHelp("Directory containing the concrete PBUI presentation-system profile")),
			fields.New("output-dir", fields.TypeString, fields.WithDefault(""), fields.WithHelp("Override the React app output directory from targets/react-app.yaml")),
			fields.New("dry-run", fields.TypeBool, fields.WithDefault(false), fields.WithHelp("Report files without writing them")),
			fields.New("force", fields.TypeBool, fields.WithDefault(false), fields.WithHelp("Overwrite existing files")),
		),
		cmds.WithSections(glazedSection, commandSettingsSection),
	)

	return &ScaffoldPBUIReactAppCommand{CommandDescription: desc}, nil
}

func (c *ScaffoldPBUIReactAppCommand) RunIntoGlazeProcessor(ctx context.Context, vals *values.Values, gp middlewares.Processor) error {
	s := &ScaffoldPBUIReactAppSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode scaffold-pbui-react-app settings")
	}

	profilePkg, concretePlan, err := buildConcreteProfilePlan(ctx, s.Root, s.InteractionsRoot, s.PBUIRoot, s.ProfileRoot)
	if err != nil {
		return err
	}
	outputDir := s.OutputDir
	if outputDir == "" {
		outputDir = profile.ResolveReactAppOutputDir(profilePkg.Root, profilePkg.ReactAppTarget.Defaults.OutputDir)
	} else {
		outputDir = filepath.Clean(outputDir)
	}
	reactPlan := profile.BuildReactAppPlan(profilePkg, concretePlan, outputDir)
	reactPlan.Generated = genmeta.CurrentGeneratedInfo("dmeta scaffold-pbui-react-app")
	reactPlan.SemanticRoot = s.Root
	reactPlan.InteractionsRoot = s.InteractionsRoot
	reactPlan.PBUIRoot = s.PBUIRoot
	reactPlan.ProfileRoot = s.ProfileRoot
	results, err := profile.WriteReactAppPlan(profilePkg, concretePlan, reactPlan, profile.ReactAppWriteOptions{DryRun: s.DryRun, Force: s.Force})
	if err != nil {
		return err
	}
	for _, result := range results {
		row := types.NewRow(
			types.MRP("path", result.Path),
			types.MRP("kind", result.Kind),
			types.MRP("action", result.Action),
		)
		if err := gp.AddRow(ctx, row); err != nil {
			return err
		}
	}
	return nil
}
