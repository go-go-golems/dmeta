#!/usr/bin/env python3
"""Convert widget template adaptation_points lists into schema maps."""
from __future__ import annotations
from pathlib import Path
from typing import Any
import yaml

ROOT = Path(__file__).resolve().parents[6]
TEMPLATE_DIRS = [
    ROOT / "sources/dmeta-ir/widget-templates",
    ROOT / "examples/street-deli-ordering/widget-templates",
]


def point_schema(name: str) -> dict[str, Any]:
    descriptions = {
        "component_name": "Concrete component name selected by the instance manifest.",
        "props": "Concrete prop surface and view-model shape for the selected instance.",
        "stories": "Storybook scenarios relevant to the selected variant and instance.",
        "presentation_mapping": "Mapping from semantic presentations to rendered slots/cells/regions.",
        "action_slots": "Typed callbacks/actions exposed by the concrete widget.",
        "density": "Density mode or spacing behavior selected for the concrete design system.",
        "empty_state": "Empty/no-results behavior and copy for this widget.",
        "mobile_layout": "Mobile-specific layout, surface, and touch target choices.",
        "copy_and_labels": "Instance-specific labels, helper text, and operator-facing copy.",
    }
    return {
        "type": "any",
        "required": False,
        "description": descriptions.get(name, f"Instance-specific adaptation for {name.replace('_', ' ')}."),
    }


def convert(obj: Any) -> None:
    if isinstance(obj, dict):
        template = obj.get("template")
        if isinstance(template, dict):
            points = template.get("adaptation_points")
            if isinstance(points, list):
                template["adaptation_points"] = {str(p): point_schema(str(p)) for p in points}
        for value in obj.values():
            convert(value)
    elif isinstance(obj, list):
        for value in obj:
            convert(value)


def main() -> None:
    for directory in TEMPLATE_DIRS:
        for path in sorted(directory.glob("*.yaml")):
            data = yaml.safe_load(path.read_text())
            convert(data)
            path.write_text(yaml.safe_dump(data, sort_keys=False, width=120))

if __name__ == "__main__":
    main()
