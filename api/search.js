export default async function handler(req, res) {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Subscription-Token': process.env.BRAVE_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Search API request failed');
    }

    const data = await response.json();
    return res.status(200).json(data.web.results);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Failed to perform search' });
  }
}