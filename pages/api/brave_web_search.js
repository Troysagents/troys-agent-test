export default async function handler(req, res) {
  try {
    const { query } = req.query;

    // Validate API key
    if (!process.env.BRAVE_API_KEY || !process.env.BRAVE_API_KEY.startsWith('BSA')) {
      throw new Error('Invalid API key configuration');
    }

    // Validate query
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Make request to Brave
    const response = await fetch('https://api.search.brave.com/res/v1/web/search', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Subscription-Token': process.env.BRAVE_API_KEY
      },
      params: {
        q: query
      }
    });

    // Handle API response
    if (!response.ok) {
      throw new Error(`Brave API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.web?.results) {
      throw new Error('No results found');
    }

    const webResults = data.web.results;

    // Process results into Claude-like format
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
    console.error('Search error:', error);
    return res.status(500).json({ 
      error: 'Failed to perform search',
      details: error.message 
    });
  }
}

function generateSummary(results, query) {
  const topResults = results.slice(0, 3);
  const mainPoints = topResults.map(result => result.description).join(' ');
  
  const cleanText = mainPoints
    .replace(/(<([^>]+)>)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return `Based on the search results for "${query}", ${cleanText}`;
}

function generateDetailedResponse(results) {
  const themes = {};
  
  results.forEach(result => {
    const cleanDescription = result.description
      .replace(/(<([^>]+)>)/gi, '')
      .trim();

    const info = {
      content: cleanDescription,
      source: result.title
    };

    const words = result
