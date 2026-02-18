## Project Notes

**Design Process**: cynthiacxzhang.me



**Supabase:** db/schema.sql

* DDL (Data Definition Language): the CREATE TABLE statement that defines the work experience table schema (columns, types, constraints)
* RLS policy (Row Level Security): a Postgres policy that controls who can read/write rows - for a public portfolio, this means SELECT allowed for anon role (unauthenticated users), so the frontend can read data without logging in
  * Supabase exposes DB via public API key (anon key)
  * Without RLS granting access, default READS are blocked
  * Policy is what grants/controls this request flow
* Seed data: INSERT statements pre-populating the table with resume work experiences

**Notion Blog Integration**: 

* Created integration at notion.so/my-integrations, linking Blog db from Career Bank to project
