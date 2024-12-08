import { useState } from 'react';
import SearchResults from './components/SearchResults';

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/brave_web_search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your search query..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
        </form>

        {/* Search Results */}
        <SearchResults results={searchResults} isLoading={isLoading} />
      </div>
    </div>
  );
}
