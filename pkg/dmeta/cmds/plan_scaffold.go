package cmds

import (
	"context"
	"strings"

	reactgen "github.com/go-go-golems/dmeta/pkg/dmeta/generator/react"
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

type PlanScaffoldCommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*PlanScaffoldCommand)(nil)

type PlanScaffoldSettings struct {
	Instance         string `glazed:"instance"`
	Target           string `glazed:"target"`
	TargetFile       string `glazed:"target-file"`
	InteractionsRoot string `glazed:"interactions-root"`
	WebRoot          string `glazed:"web-root"`
	SemanticRoot     string `glazed:"semantic-root"`
	OutputDir        string `glazed:"output-dir"`
}

func NewPlanScaffoldCommand() (*PlanScaffoldCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"plan-scaffold",
		cmds.WithShort("Plan target-specific scaffold files from MetaDesignSystem obligations"),
		cmds.WithLong(`Plan target-specific scaffold files without writing them.

For --target react, the command reads the instance manifest for selected component
names, elaborates Semantic IR into Interaction IR obligations, lowers those into
Web MetaDesignSystem obligations, then plans React files from the Web obligations.
It does not use the old generic widget renderer as the compiler path.

Examples:
  dmeta plan-scaffold --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --target react --output yaml
`),
		cmds.WithFlags(
			fields.New(
				"instance",
				fields.TypeString,
				fields.WithHelp("Path to dmeta_instance YAML manifest"),
			),
			fields.New(
				"target",
				fields.TypeString,
				fields.WithDefault("react"),
				fields.WithHelp("Scaffold target to plan; currently only react is supported"),
			),
			fields.New(
				"target-file",
				fields.TypeString,
				fields.WithDefault(""),
				fields.WithHelp("Optional React target YAML file; defaults to <interactions-root>/meta-design-systems/web/targets/react.yaml"),
			),
			fields.New(
				"interactions-root",
				fields.TypeString,
				fields.WithDefault(""),
				fields.WithHelp("Optional root containing interactions/ and the React target file; defaults to instance interactions_root"),
			),
			fields.New(
				"web-root",
				fields.TypeString,
				fields.WithDefault(""),
				fields.WithHelp("Optional Web MetaDesignSystem root; defaults to <semantic-root>/meta-design-systems/web"),
			),
			fields.New(
				"semantic-root",
				fields.TypeString,
				fields.WithDefault(""),
				fields.WithHelp("Optional semantic DMETA package root; defaults to instance_root or core_model_root from the manifest"),
			),
			fields.New(
				"output-dir",
				fields.TypeString,
				fields.WithDefault(""),
				fields.WithHelp("Optional planned output directory override"),
			),
		),
		cmds.WithSections(glazedSection, commandSettingsSection),
	)

	return &PlanScaffoldCommand{CommandDescription: desc}, nil
}

func (c *PlanScaffoldCommand) RunIntoGlazeProcessor(ctx context.Context, vals *values.Values, gp middlewares.Processor) error {
	s := &PlanScaffoldSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode plan-scaffold settings")
	}
	if s.Instance == "" {
		return errors.New("--instance is required")
	}
	if s.Target != "react" {
		return errors.Errorf("unsupported --target %q; currently only react is supported", s.Target)
	}
	plan, err := reactgen.BuildScaffoldPlan(ctx, reactgen.PlanOptions{
		InstancePath:     s.Instance,
		TargetFile:       s.TargetFile,
		InteractionsRoot: s.InteractionsRoot,
		WebRoot:          s.WebRoot,
		SemanticRoot:     s.SemanticRoot,
		OutputDir:        s.OutputDir,
	})
	if err != nil {
		return err
	}

	for _, file := range plan.Files {
		if err := gp.AddRow(ctx, types.NewRow(
			types.MRP("row_kind", "file"),
			types.MRP("instance", plan.InstanceID),
			types.MRP("target", plan.TargetID),
			types.MRP("meta_design_system", plan.MetaDesignSystem),
			types.MRP("template", ""),
			types.MRP("component", ""),
			types.MRP("variant", ""),
			types.MRP("file_kind", file.Kind),
			types.MRP("path", file.Path),
			types.MRP("symbol", file.Symbol),
			types.MRP("representations", ""),
			types.MRP("actions", ""),
			types.MRP("domain_types", ""),
			types.MRP("source_rules", ""),
			types.MRP("slots", ""),
			types.MRP("visual_states", ""),
			types.MRP("event_bindings", ""),
			types.MRP("file_count", 0),
		)); err != nil {
			return err
		}
	}

	for _, component := range plan.Components {
		if err := gp.AddRow(ctx, types.NewRow(
			types.MRP("row_kind", "component"),
			types.MRP("instance", plan.InstanceID),
			types.MRP("target", plan.TargetID),
			types.MRP("meta_design_system", plan.MetaDesignSystem),
			types.MRP("template", component.TemplateID),
			types.MRP("component", component.ComponentName),
			types.MRP("variant", component.Variant),
			types.MRP("file_kind", ""),
			types.MRP("path", ""),
			types.MRP("symbol", ""),
			types.MRP("representations", strings.Join(component.RealizesRepresentations, ",")),
			types.MRP("actions", strings.Join(component.RealizesActions, ",")),
			types.MRP("domain_types", strings.Join(component.SourceDomainTypes, ",")),
			types.MRP("source_rules", strings.Join(component.SourceRules, ",")),
			types.MRP("slots", strings.Join(component.Slots, ",")),
			types.MRP("visual_states", strings.Join(component.VisualStates, ",")),
			types.MRP("event_bindings", strings.Join(component.EventBindings, ",")),
			types.MRP("file_count", len(component.Files)),
		)); err != nil {
			return err
		}
		for _, dependency := range component.DependencyClosure {
			if err := gp.AddRow(ctx, types.NewRow(
				types.MRP("row_kind", "dependency"),
				types.MRP("instance", plan.InstanceID),
				types.MRP("target", plan.TargetID),
				types.MRP("meta_design_system", plan.MetaDesignSystem),
				types.MRP("template", component.TemplateID),
				types.MRP("component", component.ComponentName),
				types.MRP("dependency_template", dependency.TemplateID),
				types.MRP("dependency_component", dependency.ComponentName),
				types.MRP("dependency_kind", dependency.ComponentKind),
				types.MRP("dependency_role", dependency.ComponentRole),
				types.MRP("dependency_edge_role", dependency.EdgeRole),
				types.MRP("dependency_description", dependency.EdgeDescription),
				types.MRP("dependency_required", dependency.Required),
				types.MRP("dependency_direct", dependency.Direct),
				types.MRP("dependency_depth", dependency.Depth),
				types.MRP("dependency_planned", dependency.Planned),
				types.MRP("dependency_path", strings.Join(dependency.Path, " -> ")),
			)); err != nil {
				return err
			}
		}
		for _, file := range component.Files {
			if err := gp.AddRow(ctx, types.NewRow(
				types.MRP("row_kind", "file"),
				types.MRP("instance", plan.InstanceID),
				types.MRP("target", plan.TargetID),
				types.MRP("meta_design_system", plan.MetaDesignSystem),
				types.MRP("template", component.TemplateID),
				types.MRP("component", component.ComponentName),
				types.MRP("variant", component.Variant),
				types.MRP("file_kind", file.Kind),
				types.MRP("path", file.Path),
				types.MRP("symbol", file.Symbol),
				types.MRP("representations", strings.Join(file.Provenance.Representations, ",")),
				types.MRP("actions", strings.Join(file.Provenance.Actions, ",")),
				types.MRP("domain_types", strings.Join(file.Provenance.DomainTypes, ",")),
				types.MRP("source_rules", strings.Join(file.Provenance.SourceRules, ",")),
				types.MRP("slots", ""),
				types.MRP("visual_states", ""),
				types.MRP("event_bindings", ""),
				types.MRP("file_count", 0),
			)); err != nil {
				return err
			}
		}
	}
	return nil
}
