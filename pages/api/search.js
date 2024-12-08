export default async function handler(req, res) {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    if (!process.env.BRAVE_API_KEY) {
      console.error('BRAVE_API_KEY environment variable is not set');
      return res.status(500).json({ error: 'Search API key not configured' });
    }

    console.log('Making request to Brave Search API with query:', query);

    const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'X-Subscription-Token': process.env.BRAVE_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Brave API Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return res.status(response.status).json({
        error: `Brave Search API error: ${response.status} ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log('Search successful, found results:', data.web?.results?.length || 0);

    if (!data.web?.results) {
      return res.status(200).json([]);
    }

    res.status(200).json(data.web.results);
  } catch (error) {
    console.error('Search handler error:', error);
    res.status(500).json({
      error: 'Failed to perform search',
      details: error.message
    });
  }
}