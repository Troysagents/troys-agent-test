async function performSearch(query) {
    try {
        // First get the search results from Brave
        const response = await fetch(`/brave_web_search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();

        // Process the results into a synthesized response
        const processedResponse = synthesizeResults(data);
        return processedResponse;

    } catch (err) {
        console.error('Search error:', err);
        throw err;
    }
}

function synthesizeResults(searchResults) {
    // Extract relevant information from search results
    const relevantInfo = searchResults.map(result => ({
        title: result.title,
        description: result.description,
        url: result.url,
        // Add any other relevant fields
    }));

    // Create a structured response object
    const synthesizedResponse = {
        mainAnswer: generateMainAnswer(relevantInfo),
        details: generateDetails(relevantInfo),
        sources: relevantInfo.map(info => info.url), // Keep sources but don't display by default
        raw: searchResults // Keep raw data for potential debugging
    };

    return synthesizedResponse;
}

function generateMainAnswer(relevantInfo) {
    // Combine the most relevant information into a coherent paragraph
    let mainPoints = relevantInfo
        .slice(0, 3) // Take top 3 most relevant results
        .map(info => info.description)
        .join(' ');
    
    // Clean up and format the text
    return mainPoints.replace(/(<([^>]+)>)/gi, ''); // Remove HTML tags
}

function generateDetails(relevantInfo) {
    // Create a more detailed explanation from the remaining results
    return relevantInfo
        .slice(3) // Use remaining results for additional context
        .map(info => ({
            point: info.description.replace(/(<([^>]+)>)/gi, ''),
            relevance: 'Supporting Information'
        }));
}
