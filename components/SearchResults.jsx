import React, { useState } from 'react';

const SearchResults = ({ results, isLoading }) => {
  const [showSources, setShowSources] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!results) return null;

  const { summary, detailedResponse, sources } = results;

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-gray-800">
      {/* Main Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <p className="text-lg leading-relaxed">{summary}</p>
      </div>

      {/* Detailed Response Sections */}
      <div className="space-y-4">
        {detailedResponse.map((section, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              {section.topic}
              {section.sourceCount > 1 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (From {section.sourceCount} sources)
                </span>
              )}
            </h3>
            <p className="text-gray-600 leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>

      {/* Sources Section */}
      <div className="mt-6">
        <button
          onClick={() => setShowSources(!showSources)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showSources ? 'rotate-180' : ''}`}
            fill="none"
            strokeWidth="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
          <span className="text-sm font-medium">
            {showSources ? 'Hide Sources' : 'Show Sources'}
          </span>
        </button>

        {showSources && (
          <div className="mt-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Sources:</h4>
            <ul className="space-y-2">
              {sources.map((source, index) => (
                <li key={index} className="text-sm">
                  
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
    </div>
  );
}
