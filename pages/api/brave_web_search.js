export default async function handler(req, res) {
  const { query } = req.query;
  
  // Debug logging
  console.log('API route hit, checking environment...');
  const keyExists = !!process.env.BRAVE_API_KEY;
  console.log('API key exists:', keyExists);
  
  if (!keyExists) {
    return res.status(500).json({ 
      error: 'Configuration error',
      details: 'API key not found in environment' 
    });
  }

  if (!query) {
    return res.status(400).json({ 
      error: 'Invalid request',
      details: 'Query parameter is required' 
    });
  }

  try {
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`;
    console.log('Making request to:', url);

    const apiKey = process.env.BRAVE_API_KEY;
    console.log('API key length:', apiKey.length);  // Don't log the actual key, just its length

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Subscription-Token': apiKey
      }
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      return res.status(response.status).json({
        error: 'Search API error',
        details: errorText
      });
    }

    const data = await response.json();
    
    if (!data.web?.results) {
      return res.status(500).json({
        error: 'Invalid response',
        details: 'No results found in API response'
      });
    }

    return res.status(200).json({
      summary: 'Test summary',
      detailedResponse: [],
      sources: data.web.results.map(result => ({
        title: result.title,
        url: result.url
      }))
    });

  } catch (error) {
    console.error('Full error:', error);
    return res.status(500).json({ 
      error: 'Search failed',
      details: error.message
    });
  }
}
