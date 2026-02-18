// GET /api/blog/:slug — returns a single published post with markdown content
// Required env vars: NOTION_TOKEN, NOTION_BLOG_DB_ID

const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  const { slug } = req.query;
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const n2m = new NotionToMarkdown({ notionClient: notion });
  const DB_ID = process.env.NOTION_BLOG_DB_ID;

  try {
    const response = await notion.databases.query({
      database_id: DB_ID,
      filter: {
        and: [
          { property: 'Slug', rich_text: { equals: slug } },
          { property: 'Status', select: { equals: 'Published' } },
        ],
      },
    });

    if (!response.results.length) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const page = response.results[0];
    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const { parent: markdown } = n2m.toMarkdownString(mdBlocks);

    res.json({
      slug,
      title: page.properties.Title?.title?.[0]?.plain_text ?? 'Untitled',
      date: page.properties.Date?.date?.start ?? null,
      tags: page.properties.Tags?.multi_select?.map(t => t.name) ?? [],
      markdown,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};
