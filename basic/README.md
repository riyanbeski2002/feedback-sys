# Ziptrrip BA + PM Assignment Pack

This pack contains the full planning and build material for the Ziptrrip post-stay feedback assignment.

## Included files

- `01_master_build_prompt.md` — end-to-end Gemini CLI build prompt
- `02_product_requirements_document_PRD.md` — detailed PRD
- `03_functional_requirements_document_FRD.md` — detailed FRD
- `04_output_requirements.md` — expected outputs from Gemini / build agent
- `05_figma_mcp_design_prompt.md` — UI design prompt for Figma MCP or Pencil MCP
- `06_notification_design_specs.md` — email, WhatsApp, Slack and Teams notification specs
- `07_mvp_scope_and_demo_flow.md` — MVP boundaries and demo sequence
- `08_technical_architecture.md` — stack, schema, APIs, hosting, deployment
- `09_database_schema.sql` — starter SQL schema for Supabase
- `10_api_contracts.md` — endpoint contracts and payloads
- `11_seed_data.json` — mock hotels, bookings and example feedback seed data
- `12_github_readme_template.md` — README template for the repo
- `13_submission_doc_final.md` — final assignment document
- `14_tech_story_breakdown.md` — time-boxed work packages
- `15_figma_screen_inventory.md` — full screen and component list
- `16_brand_alignment_notes.md` — instructions to match Ziptrrip UI after reference screenshots are shared

## How to use

1. Read the PRD and FRD first.
2. Feed `01_master_build_prompt.md` to Gemini CLI.
3. Feed `05_figma_mcp_design_prompt.md` to Figma MCP after you attach Ziptrrip reference screenshots.
4. Use `09_database_schema.sql` in Supabase.
5. Use `11_seed_data.json` to populate the MVP.
6. Deploy on Vercel and connect Supabase.

## Notes

- Current design instructions are written to support brand alignment once you provide Ziptrrip dashboard screenshots.
- Notification designs are included for email, WhatsApp, Slack and Teams.
- AI analysis is positioned as an enhancement layer, not a hard dependency.
