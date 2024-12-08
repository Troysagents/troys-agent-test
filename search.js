async function performSearch(query) {
    try {
        const response = await fetch(`/brave_web_search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Search error:', err);
        throw err;
    }
}