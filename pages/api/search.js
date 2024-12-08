export default async function handler(req, res) {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // Log the request
    console.log('Making request to Brave Search API...', { query });

    // Check if we have the API key
    if (!process.env.BRAVE_API_KEY) {
      console.error('BRAVE_API_KEY is not set');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
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
    
    // Log successful response
    console.log('Search successful:', { resultsCount: data.web?.results?.length || 0 });
    
    return res.status(200).json(data.web.results);
  } catch (error) {
    console.error('Search error:', error.message);
    return res.status(500).json({ 
      error: 'Failed to perform search',
      details: error.message
    });
  }
}