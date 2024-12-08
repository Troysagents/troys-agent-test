export default async function handler(req, res) {
  const { query } = req.query;
  
  // Add this console log to verify the API key
  console.log('API Key present:', !!process.env.BRAVE_API_KEY);
  
  if (!process.env.BRAVE_API_KEY) {
    return res.status(500).json({ error: 'Brave API key is not configured' });
  }

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
      const errorText = await response.text();
      console.error('Brave API Response:', errorText);
      throw new Error(`Brave API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.web?.results) {
      throw new Error('No results found');
    }

    const webResults = data.web.results;

    const processedResponse = {
      summary: generateSummary(webResults, query),
      detailedResponse: generateDetailedResponse(webResults),
      sources: webResults.map(result => ({
        title: result.title,
        url: result.url
      }))
    };

    return res.status(200).json(processedResponse);

  } catch (error) {
    console.error('Search error details:', error);
    return res.status(500).json({ 
      error: 'Failed to perform search',
      details: error.message 
    });
  }
}
