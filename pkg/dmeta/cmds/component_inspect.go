package cmds

import (
	"context"
	"os"
	"path/filepath"
	"sort"
	"strings"

	instancegen "github.com/go-go-golems/dmeta/pkg/dmeta/instance"
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
	"gopkg.in/yaml.v3"
)

type ListComponentsCommand struct {
	*cmds.CommandDescription
}

type ShowComponentCommand struct {
	*cmds.CommandDescription
}

var _ cmds.GlazeCommand = (*ListComponentsCommand)(nil)
var _ cmds.GlazeCommand = (*ShowComponentCommand)(nil)

type ComponentInspectSettings struct {
	Root     string `glazed:"root"`
	WebRoot  string `glazed:"web-root"`
	Instance string `glazed:"instance"`
}

type ShowComponentSettings struct {
	Root      string `glazed:"root"`
	WebRoot   string `glazed:"web-root"`
	Instance  string `glazed:"instance"`
	Component string `glazed:"component"`
	ID        string `glazed:"id"`
	Name      string `glazed:"name"`
}

type componentRecord struct {
	Widget    validator.Widget
	Raw       yaml.Node
	File      string
	SourceKey string
	Category  string
	Index     int
}

func NewListComponentsCommand() (*ListComponentsCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"list-components",
		cmds.WithShort("List Web MetaDesignSystem component/widget templates"),
		cmds.WithLong(`List component/widget templates from a Web MetaDesignSystem package.

The command loads meta-design-system.yaml, follows the widget template file entries,
and emits one row per component with source file, kind, status, semantic inputs,
actions, story coverage, and whether TypeScript/CSS source blocks are present.

Use this before promoting widgets so you do not need to scan YAML files by hand.

Examples:
  dmeta list-components --root ./sources/dmeta-ir --output table
  dmeta list-components --web-root ./sources/dmeta-ir/meta-design-systems/web --output json
  dmeta list-components --instance ./sources/dmeta-ir/instantiations/tree-center.yaml --fields id,name,kind,file
`),
		cmds.WithFlags(componentInspectFlags()...),
		cmds.WithSections(glazedSection, commandSettingsSection),
	)

	return &ListComponentsCommand{CommandDescription: desc}, nil
}

func NewShowComponentCommand() (*ShowComponentCommand, error) {
	glazedSection, err := settings.NewGlazedSchema()
	if err != nil {
		return nil, errors.Wrap(err, "create glazed section")
	}
	commandSettingsSection, err := cli.NewCommandSettingsSection()
	if err != nil {
		return nil, errors.Wrap(err, "create command settings section")
	}

	desc := cmds.NewCommandDescription(
		"show-component",
		cmds.WithShort("Show one Web MetaDesignSystem component/widget definition"),
		cmds.WithLong(`Show one component/widget template from a Web MetaDesignSystem package.

The command finds a widget by id or component name and emits both summary fields and
extracted source blocks. The definition_yaml field is the normalized YAML for the
component, which is useful when promoting a widget without manually searching the IR.

Examples:
  dmeta show-component --root ./sources/dmeta-ir --id ttc.filter_bar --output yaml
  dmeta show-component --web-root ./sources/dmeta-ir/meta-design-systems/web --component FilterBar --fields definition_yaml --output yaml
  dmeta show-component --instance ./sources/dmeta-ir/instantiations/tree-center.yaml --name FilterBar --fields id,name,file,typescript_contract,style_css --output yaml
`),
		cmds.WithFlags(showComponentFlags()...),
		cmds.WithSections(glazedSection, commandSettingsSection),
	)

	return &ShowComponentCommand{CommandDescription: desc}, nil
}

func componentInspectFlags() []*fields.Definition {
	return []*fields.Definition{
		fields.New("root", fields.TypeString, fields.WithDefault("sources/dmeta-ir"), fields.WithHelp("DMETA package root; web root defaults to <root>/meta-design-systems/web")),
		fields.New("web-root", fields.TypeString, fields.WithDefault(""), fields.WithHelp("Web MetaDesignSystem root containing meta-design-system.yaml")),
		fields.New("instance", fields.TypeString, fields.WithDefault(""), fields.WithHelp("Optional dmeta_instance manifest; uses meta_design_systems.web.root relative to the instance file")),
	}
}

func showComponentFlags() []*fields.Definition {
	flags := componentInspectFlags()
	flags = append(flags,
		fields.New("component", fields.TypeString, fields.WithDefault(""), fields.WithHelp("Component id or name to show, for example ttc.filter_bar or FilterBar")),
		fields.New("id", fields.TypeString, fields.WithDefault(""), fields.WithHelp("Exact widget/template id to show")),
		fields.New("name", fields.TypeString, fields.WithDefault(""), fields.WithHelp("Exact component name to show")),
	)
	return flags
}

func (c *ListComponentsCommand) RunIntoGlazeProcessor(ctx context.Context, vals *values.Values, gp middlewares.Processor) error {
	s := &ComponentInspectSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode list-components settings")
	}

	records, webRoot, err := loadComponentRecords(ctx, s.Root, s.WebRoot, s.Instance)
	if err != nil {
		return err
	}

	for _, record := range records {
		w := record.Widget
		row := types.NewRow(
			types.MRP("id", w.ID),
			types.MRP("name", w.Name),
			types.MRP("kind", widgetKind(w)),
			types.MRP("role", w.Component.Role),
			types.MRP("status", w.Status),
			types.MRP("file", relPath(webRoot, record.File)),
			types.MRP("source_key", record.SourceKey),
			types.MRP("index", record.Index),
			types.MRP("purpose", w.Intent.Purpose),
			types.MRP("representations", strings.Join(w.Consumes.Representations, ",")),
			types.MRP("actions", strings.Join(actionSlotNames(w), ",")),
			types.MRP("stories", strings.Join(storyNames(w), ",")),
			types.MRP("has_typescript_contract", w.Contract.TypeScript.Code != ""),
			types.MRP("has_css_template", w.Style.Code != ""),
			types.MRP("lifecycle", widgetLifecycle(w)),
		)
		if err := gp.AddRow(ctx, row); err != nil {
			return err
		}
	}
	return nil
}

func (c *ShowComponentCommand) RunIntoGlazeProcessor(ctx context.Context, vals *values.Values, gp middlewares.Processor) error {
	s := &ShowComponentSettings{}
	if err := vals.DecodeSectionInto(schema.DefaultSlug, s); err != nil {
		return errors.Wrap(err, "decode show-component settings")
	}
	query := firstNonEmpty(s.ID, s.Component, s.Name)
	if query == "" {
		return errors.New("--component, --id, or --name is required")
	}

	records, webRoot, err := loadComponentRecords(ctx, s.Root, s.WebRoot, s.Instance)
	if err != nil {
		return err
	}
	record, ok := findComponentRecord(records, s.ID, s.Name, s.Component)
	if !ok {
		return errors.Errorf("component %q not found", query)
	}

	definition, err := yaml.Marshal(&record.Raw)
	if err != nil {
		return errors.Wrap(err, "marshal component definition")
	}
	stories, err := yaml.Marshal(record.Widget.Storybook)
	if err != nil {
		return errors.Wrap(err, "marshal storybook definition")
	}
	actionSlots, err := yaml.Marshal(record.Widget.Contract.ActionSlots)
	if err != nil {
		return errors.Wrap(err, "marshal action slots")
	}

	w := record.Widget
	row := types.NewRow(
		types.MRP("id", w.ID),
		types.MRP("name", w.Name),
		types.MRP("kind", widgetKind(w)),
		types.MRP("role", w.Component.Role),
		types.MRP("status", w.Status),
		types.MRP("file", relPath(webRoot, record.File)),
		types.MRP("source_key", record.SourceKey),
		types.MRP("index", record.Index),
		types.MRP("purpose", w.Intent.Purpose),
		types.MRP("adapter_boundary", w.Intent.AdapterBoundary),
		types.MRP("representations", strings.Join(w.Consumes.Representations, ",")),
		types.MRP("capabilities", strings.Join(w.Consumes.Capabilities, ",")),
		types.MRP("archetypes", strings.Join(w.Consumes.Archetypes, ",")),
		types.MRP("actions", strings.Join(actionSlotNames(w), ",")),
		types.MRP("stories", strings.Join(storyNames(w), ",")),
		types.MRP("has_typescript_contract", w.Contract.TypeScript.Code != ""),
		types.MRP("has_css_template", w.Style.Code != ""),
		types.MRP("typescript_description", w.Contract.TypeScript.Description),
		types.MRP("typescript_intent", w.Contract.TypeScript.Intent),
		types.MRP("typescript_notes", w.Contract.TypeScript.Notes),
		types.MRP("typescript_contract", w.Contract.TypeScript.Code),
		types.MRP("style_description", w.Style.Description),
		types.MRP("style_intent", w.Style.Intent),
		types.MRP("style_notes", w.Style.Notes),
		types.MRP("style_css", w.Style.Code),
		types.MRP("storybook_yaml", string(stories)),
		types.MRP("action_slots_yaml", string(actionSlots)),
		types.MRP("definition_yaml", string(definition)),
	)
	return gp.AddRow(ctx, row)
}

func loadComponentRecords(ctx context.Context, root string, webRoot string, instancePath string) ([]componentRecord, string, error) {
	select {
	case <-ctx.Done():
		return nil, "", ctx.Err()
	default:
	}

	resolvedWebRoot, err := resolveWebRoot(root, webRoot, instancePath)
	if err != nil {
		return nil, "", err
	}
	meta, err := loadYAMLFile[webmds.MetaDesignSystemFile](filepath.Join(resolvedWebRoot, "meta-design-system.yaml"))
	if err != nil {
		return nil, "", errors.Wrap(err, "load Web MetaDesignSystem")
	}
	if meta.ArtifactType != "dmeta_meta_design_system" {
		return nil, "", errors.Errorf("Web MetaDesignSystem artifact_type is %q, expected dmeta_meta_design_system", meta.ArtifactType)
	}

	keys := make([]string, 0, len(meta.Files))
	for key := range meta.Files {
		keys = append(keys, key)
	}
	sort.Strings(keys)

	var records []componentRecord
	for _, key := range keys {
		templatePath := meta.Files[key]
		if isComponentInspectNonWidgetFile(key) || templatePath == "" {
			continue
		}
		absPath := resolvePath(resolvedWebRoot, templatePath)
		templateRecords, err := loadWidgetTemplateRecords(absPath)
		if err != nil {
			return nil, "", errors.Wrapf(err, "load Web widget template file %s", templatePath)
		}
		for i := range templateRecords {
			templateRecords[i].File = absPath
			templateRecords[i].SourceKey = key
			records = append(records, templateRecords[i])
		}
	}

	sort.SliceStable(records, func(i, j int) bool {
		return records[i].Widget.ID < records[j].Widget.ID
	})
	return records, resolvedWebRoot, nil
}

func loadWidgetTemplateRecords(path string) ([]componentRecord, error) {
	b, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var templateFile validator.WidgetTemplatesFile
	if err := yaml.Unmarshal(b, &templateFile); err != nil {
		return nil, err
	}
	if templateFile.ArtifactType != "dmeta_web_widget_templates" {
		return nil, errors.Errorf("artifact_type is %q, expected dmeta_web_widget_templates", templateFile.ArtifactType)
	}

	rawTemplates, err := rawTemplateNodes(b)
	if err != nil {
		return nil, err
	}

	records := make([]componentRecord, 0, len(templateFile.Templates))
	for i, widget := range templateFile.Templates {
		raw := yaml.Node{}
		if i < len(rawTemplates) {
			raw = rawTemplates[i]
		}
		records = append(records, componentRecord{
			Widget:   widget,
			Raw:      raw,
			Category: templateFile.Category,
			Index:    i,
		})
	}
	return records, nil
}

func rawTemplateNodes(b []byte) ([]yaml.Node, error) {
	var doc yaml.Node
	if err := yaml.Unmarshal(b, &doc); err != nil {
		return nil, err
	}
	if len(doc.Content) == 0 {
		return nil, nil
	}
	root := doc.Content[0]
	if root.Kind != yaml.MappingNode {
		return nil, nil
	}
	for i := 0; i+1 < len(root.Content); i += 2 {
		key := root.Content[i]
		value := root.Content[i+1]
		if key.Value != "templates" || value.Kind != yaml.SequenceNode {
			continue
		}
		out := make([]yaml.Node, 0, len(value.Content))
		for _, node := range value.Content {
			out = append(out, *node)
		}
		return out, nil
	}
	return nil, nil
}

func resolveWebRoot(root string, webRoot string, instancePath string) (string, error) {
	if webRoot != "" {
		return filepath.Abs(webRoot)
	}
	if instancePath != "" {
		instance, instanceDir, err := instancegen.LoadInstance(instancePath)
		if err != nil {
			return "", err
		}
		webRef, ok := instance.MetaDesignSystems["web"]
		if !ok || webRef.Root == "" {
			return "", errors.New("instance meta_design_systems.web.root is required")
		}
		return filepath.Abs(resolvePath(instanceDir, webRef.Root))
	}
	if root == "" {
		root = "sources/dmeta-ir"
	}
	return filepath.Abs(filepath.Join(root, "meta-design-systems", "web"))
}

func resolvePath(base string, path string) string {
	if filepath.IsAbs(path) {
		return path
	}
	return filepath.Join(base, path)
}

func loadYAMLFile[T any](path string) (T, error) {
	var out T
	b, err := os.ReadFile(path)
	if err != nil {
		return out, err
	}
	if err := yaml.Unmarshal(b, &out); err != nil {
		return out, err
	}
	return out, nil
}

func isComponentInspectNonWidgetFile(key string) bool {
	switch key {
	case "index", "lowering_rules", "component_system", "style_tokens", "style_recipes":
		return true
	default:
		return false
	}
}

func findComponentRecord(records []componentRecord, id string, name string, component string) (componentRecord, bool) {
	for _, record := range records {
		w := record.Widget
		if id != "" && w.ID == id {
			return record, true
		}
		if name != "" && w.Name == name {
			return record, true
		}
		if component != "" && (w.ID == component || w.Name == component) {
			return record, true
		}
	}
	lowerComponent := strings.ToLower(component)
	lowerName := strings.ToLower(name)
	for _, record := range records {
		w := record.Widget
		if component != "" && (strings.ToLower(w.ID) == lowerComponent || strings.ToLower(w.Name) == lowerComponent) {
			return record, true
		}
		if name != "" && strings.ToLower(w.Name) == lowerName {
			return record, true
		}
	}
	return componentRecord{}, false
}

func widgetKind(w validator.Widget) string {
	if w.Component.Level != "" {
		return w.Component.Level
	}
	if w.Template.Category != "" {
		return w.Template.Category
	}
	return ""
}

func widgetLifecycle(w validator.Widget) string {
	return w.Component.GenerationPolicy
}

func actionSlotNames(w validator.Widget) []string {
	seen := map[string]bool{}
	var keys []string
	for key, slot := range w.Contract.ActionSlots {
		name := key
		if slot.ActionRef != "" {
			name = slot.ActionRef
		}
		if name != "" && !seen[name] {
			seen[name] = true
			keys = append(keys, name)
		}
	}
	for _, name := range w.ContractActions {
		if name != "" && !seen[name] {
			seen[name] = true
			keys = append(keys, name)
		}
	}
	if len(keys) == 0 {
		return nil
	}
	sort.Strings(keys)
	return keys
}

func storyNames(w validator.Widget) []string {
	if len(w.Storybook.Stories) > 0 {
		out := make([]string, 0, len(w.Storybook.Stories))
		for _, story := range w.Storybook.Stories {
			if story.Name != "" {
				out = append(out, story.Name)
			} else if story.State != "" {
				out = append(out, story.State)
			}
		}
		return out
	}
	return w.Stories
}

func relPath(base string, path string) string {
	rel, err := filepath.Rel(base, path)
	if err != nil {
		return path
	}
	return rel
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if value != "" {
			return value
		}
	}
	return ""
}
