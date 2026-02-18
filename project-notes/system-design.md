## Personal Site - System Design

The architecture separates concerns across three distinct layers, mapped to the following systems design principles. For diagram, see mermaid flowchart in README.md

**Persistence Layer - Supabase (PostgreSQL)** handles structured, relational work experience data. 

- Work entries have a fixed schema (company, role, dates, description) -> relational store
- Anon key + RLS policy pattern is the data access layer controlling reads/writes:
  - "app → access → data"
  - CRUD operations gated by the Public read policy
  - scoped to the `anon` role

**Application Layer - Vercel Serverless Functions** (`api/blog/index.js`, `api/blog/[slug].js`) ->  compute layer between frontend and Notion

- The Notion API can't be called directly from browser without exposing `NOTION_TOKEN`
- Vercel's serverless functions serve as reverse proxies (pre-web server)
  - Holds secrets server-side and forwards sanitized responses to the client
  - Each route does one thing: list posts, or fetch a single post by slug.
- Design focus: autonomy and modularity

**Notion as a CMS** is a managed store for unstructured content (blog posts). 

- `notion-to-md` performs a lightweight ETL at request time
- extracts Notion's block-based JSON, transforms to markdown, and loads it into the HTTP response sent to the frontend

**Frontend (User Layer)**)(`blog.html`, `work.html`) is the presentation layer - client-side rendering. 

- Work data: fetched directly from Supabase's auto-generated REST API -> safe because RLS restricts it to public reads
- Blog data: fetched through Vercel API routes (necessary, Notion token must stay internal/server-side)

**Database Choices:** Work experience is structured and rarely changes -> SQL -> Supabase (PostgresSQL BaaS)

- Blog posts are rich content authored in a real editor -> Notion
- Different data types, different stores, flexible and utility-centric.
