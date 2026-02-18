// GET /api/blog — returns list of published posts from Notion database
// Required env vars: NOTION_TOKEN, NOTION_BLOG_DB_ID

const { Client } = require('@notionhq/client');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const DB_ID = process.env.NOTION_BLOG_DB_ID;

  try {
    const response = await notion.databases.query({
      database_id: DB_ID,
      filter: {
        property: 'Status',
        select: { equals: 'Published' },
      },
      sorts: [{ property: 'Date', direction: 'descending' }],
    });

    const posts = response.results.map(page => ({
      id: page.id,
      slug: page.properties.Slug?.rich_text?.[0]?.plain_text ?? page.id,
      title: page.properties.Title?.title?.[0]?.plain_text ?? 'Untitled',
      date: page.properties.Date?.date?.start ?? null,
      tags: page.properties.Tags?.multi_select?.map(t => t.name) ?? [],
    }));

    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};
