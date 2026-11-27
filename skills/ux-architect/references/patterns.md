# Pattern catalogue

Read this file when you choose a container or a flow. Rules come before examples. When two
rules disagree, keep context (principle 1) and pick the least invasive pattern that still
shows the whole decision.

## 1. Container selection

| Container | Choose when | Cost |
| --- | --- | --- |
| Inline edit | The change is one value in a row the member already reads. | Needs a visible save state and a way back. |
| Popover or menu | The choice is short, the list is short, and the trigger stays visible. | Poor on phones. Do not nest. |
| Drawer or side panel | The task needs the list behind it, and the list is the reference for the decision. | Narrow at 1100. The panel must own its focus and its close. |
| Dialog | The task is short, blocking, and must finish before the background makes sense. | Interrupts. One decision per dialog. |
| Full page | The task needs room, a URL, or a reload-safe draft. | Leaves the context. Offer a way back and keep the draft. |
| Wizard or stepper | The task has ordered steps, later steps depend on earlier answers, and the member cannot see the end yet. | Hides total effort. Show step count and what remains. |
| Inline expansion | The detail is evidence for the row the member reads, and only sometimes needed. | Must not shift the row's own actions out of reach. |

Selection rules:

1. If the member must compare the change with the surface behind it, use a drawer or an
   inline pattern, not a full page.
2. If the change is a single value with a valid default, use inline edit and save on blur with
   an undo, not a dialog.
3. If the task creates something with more than three required fields, use a full page or a
   wizard so the draft survives a reload.
4. If the task decides one item that the member already sees, keep the item on screen and
   collect the decision beside it.
5. If the task destroys data that no action restores, use one dialog with the consequence in
   the body and the destructive action as the second button.
6. If the member repeats the same shape of task often, prefer inline over dialog even when the
   dialog is shorter. Speed comes from staying in place.

## 2. Flow rules

1. Ask for a fact once. Do not repeat a value the member already gave in another step to
   confirm it.
2. Put the blocking decision first. Do not collect details that a refusal would discard.
3. State the total effort before the first step when the flow has more than three steps.
4. Keep the draft. A reload, an expired session or a failed request must not lose typed input.
5. Show what changed after each step, so the member can see progress without finishing.
6. Send the member forward to the next real thing. A done state that only says "done" is a
   dead end.
7. Never let a repeated confirmation record two results. State the identity the server keeps.

## 3. Information hierarchy

Order the surface by what the member acts on:

1. The state and its next action.
2. The numbers that change the decision: count, deadline, cost, remaining, waiting.
3. The content the member decides on.
4. The evidence and history.
5. The settings and the advanced options.

Rules:

- A figure the platform did not measure stays unknown. Never render it as zero.
- Put the reason before the control that depends on it. Do not explain a disabled action after
  the member clicks it.
- Group by the member's decision, not by the platform's table.
- One heading per group. Do not add a heading to a group of one line.

## 4. State checklist

For every state, name the text and the action.

| State | The surface says | The surface offers |
| --- | --- | --- |
| Loading | What is loading. Use a skeleton for a known shape, a line for an unknown one. | Nothing that implies a result. |
| Empty | Why it is empty and what fills it. | The one action that fills it, when the reader may act. |
| Partial | Which part is missing and what still works. | The rest of the surface, still usable. |
| Busy | The action in flight, on the control that started it. | The other actions stay usable when the server allows it. |
| Error | That the read or the write failed, and that it is not empty. | Retry, and the input kept intact. |
| Refused | The rule that refused it, and who can allow it. | The next step that reaches a person who may. |
| Done | The result, and where it now lives. | Open the result, or the next task. |

A failed read is a failure. Never fall back to a fixture or to an empty list that looks
complete.

## 5. Anti-patterns

- A dialog that opens a dialog.
- A wizard whose steps do not depend on each other.
- A form that offers "Save" and "Save and close" and no cancel that keeps the draft.
- A confirmation dialog for a save that an undo could reverse.
- A drawer that hides the list the member must compare against.
- A count, a deadline or a limit shown as an icon with no label.
- An empty state that says "No data" and names no action.
- A disabled button with no visible reason and no way to reach the reason.
- A destructive action in the primary button position.
- A pattern that needs horizontal scrolling at 390 width.

## 6. Accessibility rules that change the pattern

1. A drawer, dialog and popover take focus, close on Escape and return focus to the trigger.
2. Every control keeps an accessible name that states its target, not only its verb.
3. A status change that the member must notice is announced, not only coloured.
4. Keyboard order follows the visual order of the flow.
5. The pattern must work at 200 percent zoom without a two-dimensional scroll.

## 7. Klingit examples

Use these to check a proposal against surfaces that already exist. Read the code before you
cite one.

- **Decide a review item** - the frozen item stays on screen and the thread and the decision
  sit beside it. A full page would hide the evidence the decision depends on.
- **Record how a piece performed** - a small form on the piece's own surface, saved in place,
  because the member reads the piece while they answer.
- **Accept a route into the plan** - the server states the recommended day and the earliest
  workable day. Show the difference before the confirm, since the member cannot compute it.
- **Start a brief** - a full page with a saved draft and a conversation, because the task is
  long, reload-safe and addressable.
- **Put a project away** - one dialog that names the project and states that the archive keeps
  it readable.
- **A stale decision** - the read names the stage the member saw. A refusal states that the
  surface is stale and reloads it, and it does not record a decision.
