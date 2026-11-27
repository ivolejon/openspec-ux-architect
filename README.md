# openspec-ux-architect

An OpenSpec workflow schema that draws UI wireframes during planning, so you see and change the interface before implementation starts.

It is a fork of the built-in `spec-driven` schema with one extra artifact, `wireframes`, which delegates its work to the `/skill:ux-architect` skill.

## What the artifact does

The `wireframes` artifact runs after `specs` and before `design`. Its instruction tells the agent to:

1. Decide whether the change touches a user-visible surface, and skip the artifact if it does not.
2. Run `/skill:ux-architect` once per flow the change adds or changes.
3. Copy the rendered images into `ui/` inside the change folder.
4. Write one Markdown file per flow that names the entry point, the states, the decisions and what the sketch leaves open, with the images referenced from it.

The wireframes stay out of the delta specs. A spec states behavior, and a sketch is planning input, so it lives beside the change and never enters `openspec/specs/`.

## Why a separate artifact instead of a rule

A rule in `openspec/config.yaml` only adds advisory text to an existing artifact. Nothing tracks whether the step happened, and `openspec status` cannot show it.

An artifact is part of the schema. It appears in `openspec status`, it has a template and an output path, and the propose workflow walks it in dependency order. It is also the only documented way to hand artifact creation to a skill: the propose workflow invokes a skill when an artifact's `instruction` delegates to one.

## Does it block implementation

No. `apply` still requires only `tasks`. The artifact is listed in `tasks.requires` instead, which puts it in the set the propose workflow creates without making it a gate: OpenSpec checks artifact files for existence only, so implementation can start even when the wireframes were never drawn.

That is deliberate. The point is to see the sketches while the plan is still cheap to change, not to hold the work hostage.

If you do want the gate, add `wireframes` to `apply.requires` in `openspec/schemas/ux-architect/schema.yaml`:

```yaml
apply:
  requires: [tasks, wireframes]
  tracks: tasks.md
```

## Install

Requires OpenSpec 2.x and Node.js. Verified with OpenSpec 2.2.0.

```bash
git clone https://github.com/ivolejon/openspec-ux-architect.git /tmp/openspec-ux-architect

# in your project
mkdir -p openspec/schemas .agents/skills
cp -r /tmp/openspec-ux-architect/openspec/schemas/ux-architect openspec/schemas/
cp -r /tmp/openspec-ux-architect/skills/ux-architect .agents/skills/

openspec schema validate ux-architect
```

Make it the default for new changes in `openspec/config.yaml`:

```yaml
schema: ux-architect
```

Or choose it per change:

```bash
openspec new change my-change --schema ux-architect
```

Existing changes keep the schema recorded in their own `.openspec.yaml`, so switching the default does not rewrite them.

## What a planning run looks like

```text
$ openspec status --change add-export-dialog
Change: add-export-dialog
Schema: ux-architect
Progress: 1/5 artifacts complete

[x] proposal
[ ] specs
[ ] wireframes
[ ] design
[ ] tasks

Next: openspec instructions specs --change "add-export-dialog" --json
```

The artifact produces files like these:

```text
openspec/changes/add-export-dialog/
├── proposal.md
├── specs/export/spec.md
├── ui/
│   ├── export-dialog.md
│   ├── export-dialog-desktop.png
│   └── export-dialog-mobile.png
├── design.md
└── tasks.md
```

## The skill

`skills/ux-architect` is the skill this schema calls. It decides the container, the step order, the information hierarchy and the states, then renders low-fidelity wireframes with Playwright Chromium.

It was written for one repository and carries some assumptions about it:

- `docs/klarsprak.md` and `docs/asd-ste100.md` for Swedish and English writing standards.
- `apps/web/src/styles.css` and `apps/web/src/components/ds` for the design tokens and components.
- `apps/web`'s Playwright installation for the renderer.

In another project, either adjust those references or keep the schema and bring your own skill under the same name. The schema only depends on the skill being called `/skill:ux-architect` and on it producing image files.

## Staying in sync with spec-driven

The schema is a copy, so upstream changes to `spec-driven` do not arrive on their own. To adopt a newer built-in schema:

```bash
openspec schema fork spec-driven ux-architect-new
```

then copy the `wireframes` artifact block from `openspec/schemas/ux-architect/schema.yaml`, add `wireframes` to `tasks.requires`, and copy `templates/wireframes.md`.

## Scope and status

`schema` is marked experimental in the OpenSpec CLI, so the command surface may change. The contents of a schema file are documented in [OpenSpec customization](https://github.com/Fission-AI/OpenSpec/blob/main/docs/customization.md).

## Licence

MIT.
