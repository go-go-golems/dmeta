package cmds

import (
	"context"
	"fmt"

	instancegen "github.com/go-go-golems/dmeta/pkg/dmeta/instance"
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

type PlanInstanceCommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*PlanInstanceCommand)(nil)

type PlanInstanceSettings struct {
	Root     string `glazed:"root"`
	Instance string `glazed:"instance"`
}

func NewPlanInstanceCommand() (*PlanInstanceCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"plan-instance",
		cmds.WithShort("Validate and summarize selected Web templates for a DMETA instance"),
		cmds.WithLong(`Plan a concrete DMETA instance before target scaffolding.

The command loads the global Web template catalog and local Web template files
referenced by the instance manifest. It validates selected/excluded template ids,
duplicate component aliases, variant names, and missing selection/exclusion reasons,
then emits a compact plan table.

Examples:
  dmeta plan-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --output table
`),
		cmds.WithFlags(
			fields.New(
				"root",
				fields.TypeString,
				fields.WithDefault(""),
				fields.WithHelp("Optional global DMETA IR root; when empty uses interactions_root from the instance manifest"),
			),
			fields.New(
				"instance",
				fields.TypeString,
				fields.WithHelp("Path to dmeta_instance YAML manifest"),
			),
		),
		cmds.WithSections(glazedSection, commandSettingsSection),
	)

	return &PlanInstanceCommand{CommandDescription: desc}, nil
}

func (c *PlanInstanceCommand) RunIntoGlazeProcessor(ctx context.Context, vals *values.Values, gp middlewares.Processor) error {
	s := &PlanInstanceSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode plan-instance settings")
	}
	if s.Instance == "" {
		return errors.New("--instance is required")
	}
	instance, instanceDir, err := instancegen.LoadInstance(s.Instance)
	if err != nil {
		return err
	}
	catalog, err := instancegen.LoadTemplateCatalog(ctx, s.Root, instanceDir, instance)
	if err != nil {
		return err
	}

	findings := instancegen.ValidateInstanceAgainstCatalog(instance, catalog)
	for _, selected := range instance.SelectedTemplates {
		widget, ok := catalog.Templates[selected.Template]
		status := "selected"
		if !ok {
			status = "error"
		}
		component := selected.As
		if component == "" && ok {
			component = widget.Name
		}
		category := ""
		if ok {
			category = widget.Template.Category
		}
		if err := gp.AddRow(ctx, types.NewRow(
			types.MRP("kind", "selected"),
			types.MRP("template", selected.Template),
			types.MRP("component", component),
			types.MRP("variant", selected.Variant),
			types.MRP("category", category),
			types.MRP("status", status),
			types.MRP("reason", selected.Reason),
		)); err != nil {
			return err
		}
	}
	for _, excluded := range instance.ExcludedTemplates {
		_, ok := catalog.Templates[excluded.Template]
		status := "excluded"
		if !ok {
			status = "error"
		}
		if err := gp.AddRow(ctx, types.NewRow(
			types.MRP("kind", "excluded"),
			types.MRP("template", excluded.Template),
			types.MRP("component", ""),
			types.MRP("variant", ""),
			types.MRP("category", ""),
			types.MRP("status", status),
			types.MRP("reason", excluded.Reason),
		)); err != nil {
			return err
		}
	}
	for _, finding := range findings {
		if err := gp.AddRow(ctx, types.NewRow(
			types.MRP("kind", "finding"),
			types.MRP("template", finding.Subject),
			types.MRP("component", ""),
			types.MRP("variant", ""),
			types.MRP("category", finding.Code),
			types.MRP("status", finding.Severity),
			types.MRP("reason", stringsJoinNonEmpty(finding.Message, finding.Detail)),
		)); err != nil {
			return err
		}
	}
	if hasPlanErrors(findings) {
		return fmt.Errorf("instance plan has error-severity findings")
	}
	return nil
}

func hasPlanErrors(findings []instancegen.PlanFinding) bool {
	for _, finding := range findings {
		if finding.Severity == "error" {
			return true
		}
	}
	return false
}

func stringsJoinNonEmpty(a string, b string) string {
	if a == "" {
		return b
	}
	if b == "" {
		return a
	}
	return a + ": " + b
}
