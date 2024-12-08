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
    const webResults = data.web.results;

    // Process results into a Claude-like response
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
    return res.status(500).json({ error: 'Failed to perform search' });
  }
}

function generateSummary(results, query) {
  // Extract main points from top results
  const topResults = results.slice(0, 3);
  const mainPoints = topResults.map(result => result.description).join(' ');
  
  // Clean and format the text
  const cleanText = mainPoints
    .replace(/(<([^>]+)>)/gi, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Remove extra whitespace
    .trim();

  // Create a conversational opening
  return `Based on the search results for "${query}", ${cleanText}`;
}

function generateDetailedResponse(results) {
  // Group information by themes/topics
  const themes = {};
  
  results.forEach(result => {
    const cleanDescription = result.description
      .replace(/(<([^>]+)>)/gi, '')
      .trim();

    // Extract key information
    const info = {
      content: cleanDescription,
      source: result.title
    };

    // Simple topic extraction (can be enhanced with NLP)
    const words = result.title.toLowerCase().split(' ');
    const topic = words[0];

    if (!themes[topic]) {
      themes[topic] = [];
    }
    themes[topic].push(info);
  });

  // Format detailed response sections
  const sections = Object.entries(themes).map(([topic, infos]) => ({
    topic: topic.charAt(0).toUpperCase() + topic.slice(1),
    content: infos.map(info => info.content).join(' '),
    sourceCount: infos.length
  }));

  return sections;
}