# UI wireframes

A wireframe is an image, not ASCII art. It shows the layout, the hierarchy and the state of a
surface in grey boxes and real labels. It does not show styling: no brand colour, no brand
type, no tokens, no component library. The implementation still reads
`apps/web/src/styles.css` and `apps/web/src/components/ds`.

Terminology:

- **UI-wireframe** - the drawn layout of one surface in one state. This is what you produce.
- **Flödesschema** (flow diagram) - boxes and arrows between surfaces. Write it only when the
  flow itself is the question, and keep it separate from the wireframe.

## 1. Produce one

```bash
mkdir -p /tmp/ux-wireframes
cp .pi/skills/ux-architect/references/wireframe-template.html /tmp/ux-wireframes/<slug>.html
# edit the body: content, sections, actions, markers and notes
node .pi/skills/ux-architect/scripts/render-wireframe.mjs \
  --html /tmp/ux-wireframes/<slug>.html \
  --state page --state confirm \
  --viewport 1440x900 --viewport 1100x900 --viewport 390x844
```

The renderer writes PNG files to `/tmp/ux-wireframes/<slug>/` and prints their paths. The name
of each file states the surface, the state and the width, for example
`accept-route-confirm-390x844.png`.

- `--state` sets `data-state` on `<body>`. The kit knows `page`, `confirm`, `busy`, `empty` and
  `error`. Render only the states that carry a decision; do not render five for a page whose
  empty state says one sentence.
- `--viewport` accepts any `WIDTHxHEIGHT`. Default is `1440x900` and `390x844`.
- `--no-full-page` captures the viewport only. Use it for a dialog or a sheet, because the dim
  backdrop covers the viewport and a full-page capture would put it in the middle of a long
  page.
- `--scale` defaults to 2, so the image stays sharp when a reader zooms.

The kit switches layout by width on its own: the rail folds at 1150 and goes away at 700, the
fact row stacks at 700, and the actions become full width at 700. Check the rendered image at
each width instead of assuming that.

## 2. Rules

1. **Grey only.** The wireframe must not look like a design proposal. Colour belongs to the
   real surface.
2. **Real labels, real lengths.** Write the label the member will read, at the length it will
   have. A placeholder such as "Lorem" hides the wrapping problem the layout must solve.
3. **One primary action per state.** The kit has one filled button. If a state needs two,
   the state is not one decision.
4. **Annotate the decisions.** Put `<span class="mk">N</span>` beside the element the decision
   concerns, and write note N under the frame. A wireframe without notes is a picture; with
   notes it is a specification.
5. **Number per state, not per element.** Notes that only apply to the dialog carry
   `data-for="confirm"` in the kit, so the numbering stays sequential in each state.
6. **No invented numbers in the notes.** If a figure comes from an assumption, say so in the
   answer and keep it out of the image.
7. **Copy in the repository's language.** The kit ships English prose. Replace it with the
   member's language, and follow `docs/klarsprak.md` for Swedish copy.
8. **Never state a result the platform does not produce.** A wireframe of a saving state is
   fine; a wireframe that claims a saved credit balance is not.

## 3. Widths that matter

| Change | Render |
| --- | --- |
| A new surface or a shell change | 1440x900, 1100x900 and 390x844 |
| A dialog, drawer or panel | 1440x900 and 390x844, the second one with `--no-full-page` |
| Content inside an existing grid | 1440x900, and 390x844 only when the grid changes |
| A phone-only flow | 390x844 only |

A pattern that needs horizontal scrolling at 390 is not settled. Fix the layout in the
wireframe before the implementer writes CSS.

## 4. Check the image before you show it

Open every PNG with the read tool and look at it. Fix what you see, then render again.

- No text is cut, overlapped or clipped by a marker.
- Every marker has a note, and every note has a marker.
- The stamp names the surface and the state, and states the width it was captured at.
- One filled button.
- The notes fit under the frame without a scroll at 1440.
- The dialog covers the viewport at 390, and nothing behind it is readable through it.

## 5. Deliver

Give the image paths, one line per image stating the surface, the state and the width. Show
the images in the answer when the client can display them.

- A design draft stays in `/tmp/ux-wireframes/`. Do not commit a draft that nobody asked for.
- A pull request that needs captures commits them under `apps/web/screenshots/<area>/`, with a
  `README.md` line per file, as the repository's screenshot rule requires.
- The wireframe is not the implementation. State in one sentence which parts of the drawing the
  implementation may change without asking, and which parts are the decision.

## 6. When no browser is available

State the limit. A text sketch in a code block is the fallback, and it must be labelled as a
sketch rather than a wireframe. Playwright Chromium ships with `apps/web`; if it is missing,
run `npm ci` in `apps/web` and `npx playwright install chromium` before you fall back.
