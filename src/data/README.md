# Data Directory Structure

This directory contains all data for the Shallow Review website.

## Folders

### `gavento/` - Pipeline Data

Data from [Tomas Gavento's shallow-review pipeline](https://github.com/gavento/shallow-review).

#### `gavento/import/` - Pipeline Input

| File | Description |
|------|-------------|
| `source.yaml` | Raw parsed markdown output from the pipeline |
| `adjustments.yaml` | Manual overrides for item types and parent relationships |

#### `gavento/generated/` - Built from Pipeline

| File | Description |
|------|-------------|
| `agendas.yaml` | All research agendas with their attributes |
| `sections.yaml` | Section definitions and descriptions |

**Warning:** Files in `gavento/generated/` will be **overwritten** on next pipeline conversion. To fix issues, modify `gavento/import/adjustments.yaml` instead.

### `reference/` - Manual Reference Data

Manually maintained taxonomies and entity definitions. These are **NOT** overwritten by the pipeline.

| File | Description |
|------|-------------|
| `structure.yaml` | Hierarchy and ordering of sections/agendas |
| `labs.yaml` | AI lab details (teams, papers, critiques) |
| `funders.yaml` | Funding organizations |
| `researchers.yaml` | Researcher profiles |
| `keywords.yaml` | Technical keyword definitions |
| `orthodoxProblems.yaml` | The 13 orthodox AI safety problems |
| `broadApproaches.yaml` | Research approach categories |
| `targetCases.yaml` | Target case definitions |
| `lesswrongTags.yaml` | LessWrong tag metadata |
| `agendaLesswrongTags.yaml` | Agenda-to-LessWrong-tag mappings |

## How to Make Changes

| What you want to do | Where to edit |
|---------------------|---------------|
| Add/edit a lab | `reference/labs.yaml` |
| Add/edit a funder or researcher | `reference/funders.yaml` or `reference/researchers.yaml` |
| Fix an agenda's parent or type | `gavento/import/adjustments.yaml`, then run `npm run convert-gavento` |
| Add content to an agenda | For now, edit `gavento/generated/agendas.yaml` directly (will be overwritten on re-import) |
| Import new pipeline data | Replace `gavento/import/source.yaml`, run `npm run convert-gavento` |

## Pipeline Conversion

The conversion script (`scripts/convert-shallow-review-pipeline.js`) transforms the raw pipeline output into the website's data format:

```
gavento/import/source.yaml  ──┐
                              ├──> npm run convert-gavento ──> gavento/generated/*.yaml
gavento/import/adjustments.yaml ─┘
```

Run with:
```bash
npm run convert-gavento
```
