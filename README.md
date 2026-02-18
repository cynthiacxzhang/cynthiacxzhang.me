# cynthiacxzhang.me

Personal site - [cynthiacxzhang.github.io/cynthiacxzhang.me](https://cynthiacxzhang.github.io/cynthiacxzhang.me/)

Mermaid Flowchart - Project Design

flowchart TD

    A["PRESENTATION LAYER
    index.html / work.html / blog.html
    client-side rendering, fetch() calls"]

    A -->|direct REST| B["PERSISTENCE LAYER
    Supabase / PostgreSQL
    work_experiences table
    RLS: anon SELECT only"]

    A -->|API route| C["APPLICATION LAYER
    Vercel Serverless Functions
    api/blog/index.js
    api/blog/slug.js
    reverse proxy — hides NOTION_TOKEN"]

    C -->|Notion API| D["DATA LAYER
    Notion Database
    metadata: Title, Slug, Date, Tags, Status
    content: page blocks
    notion-to-md ETL → markdown"]
