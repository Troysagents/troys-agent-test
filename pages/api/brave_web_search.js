export default async function handler(req, res) {
  try {
    // 1. Log initial request info
    console.log('Starting API request handler');
    const { query } = req.query;
    console.log('Received query:', query);

    // 2. Validate API key
    if (!process.env.BRAVE_API_KEY) {
      console.error('BRAVE_API_KEY not found in environment');
      throw new Error('API key not configured');
    }

    // 3. Validate query
    if (!query) {
      console.error('No search query provided');
      throw new Error('Search query is required');
    }

    // 4. Make request to Brave
    const searchUrl = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`;
    console.log('Making request to Brave API');
    
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': process.env.BRAVE_API_KEY
      }
    });

    // 5. Check response
    console.log('Brave API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Brave API error response:', errorText);
      throw new Error(`Brave API error: ${response.status} - ${errorText}`);
    }

    // 6. Parse response
    const data = await response.json();
    console.log('Successfully received data from Brave');

    // 7. Validate data structure
    if (!data.web?.results) {
      console.error('Invalid data structure received:', data);
      throw new Error('Invalid response format from Brave API');
    }

    // 8. Process results
    const webResults = data.web.results;
    const processedResponse = {
      summary: `Found ${webResults.length} results for "${query}"`,
      detailedResponse: [{
        topic: "Results",
        content: webResults[0].description,
        sourceCount: webResults.length
      }],
      sources: webResults.map(result => ({
        title: result.title,
        url: result.url
      }))
    };

    // 9. Send successful response
    return res.status(200).json(processedResponse);

  } catch (error) {
    // 10. Error handling with detailed information
    console.error('Full error details:', error);
    return res.status(500).json({
      error: 'Failed to perform search',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
