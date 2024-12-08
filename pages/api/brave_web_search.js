export default async function handler(req, res) {
  const { query } = req.query;
  
  if (!query) {
    console.log('No query provided');
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  console.log('Starting search with query:', query);
  console.log('Checking BRAVE_API_KEY:', process.env.BRAVE_API_KEY ? 'Present' : 'Missing');

  try {
    const searchUrl = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`;
    console.log('Making request to:', searchUrl);

    const response = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Subscription-Token': process.env.BRAVE_API_KEY
      }
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Search API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Received data structure:', Object.keys(data));

    if (!data.web?.results) {
      console.log('No web results in response:', data);
      throw new Error('No web results found in API response');
    }

    const webResults = data.web.results;
    console.log('Number of results:', webResults.length);

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
    console.error('Detailed search error:', error);
    console.error('Error stack:', error.stack);
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

    const words = result.title.toLowerCase().split(' ');
    const topic = words[0];

    if (!themes[topic]) {
      themes[topic] = [];
    }
    themes[topic].push(info);
  });

  const sections = Object.entries(themes).map(([topic, infos]) => ({
    topic: topic.charAt(0).toUpperCase() + topic.slice(1),
    content: infos.map(info => info.content).join(' '),
    sourceCount: infos.length
  }));

  return sections;
}
