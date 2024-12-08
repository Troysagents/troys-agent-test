export default async function handler(req, res) {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': process.env.BRAVE_API_KEY
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Brave API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return res.status(200).json(data.web?.results || []);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ 
      error: 'Failed to perform search',
      details: error.message 
    });
  }
}