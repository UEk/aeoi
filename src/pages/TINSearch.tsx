import { useState } from 'react';
import { Search } from 'lucide-react';
import { supabase, TINIndex } from '../lib/supabase';
import { normalizeTIN, hashTIN, generateCorrelationId } from '../lib/utils';

export function TINSearch() {
  const [searchValue, setSearchValue] = useState('');
  const [prefixSearch, setPrefixSearch] = useState(false);
  const [results, setResults] = useState<TINIndex[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const PAGE_SIZE = 20;

  const handleSearch = async (page: number = 0) => {
    if (!searchValue.trim()) {
      alert('Please enter a TIN to search');
      return;
    }

    setLoading(true);
    setCurrentPage(page);

    try {
      const normalized = normalizeTIN(searchValue);
      const correlationId = generateCorrelationId();

      let query = supabase
        .from('tin_index')
        .select('*')
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

      if (prefixSearch) {
        query = query.ilike('tin_normalized', `${normalized}%`);
      } else {
        query = query.eq('tin_normalized', normalized);
      }

      const { data, error } = await query;

      if (error) throw error;

      setResults(data || []);
      setHasMore(data && data.length === PAGE_SIZE + 1);

      const tinHash = hashTIN(searchValue);
      await supabase.from('audit_log').insert({
        correlation_id: correlationId,
        actor_id: 'anonymous',
        action: 'SEARCH_TIN',
        details: {
          tinHash,
          prefixSearch,
          resultCount: data?.length || 0,
        },
      });
    } catch (error: any) {
      console.error('Search error:', error);
      alert(`Search failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(0);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">TIN Search</h1>
        <p className="mt-1 text-sm text-gray-600">
          Search for Tax Identification Numbers with normalized matching
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Identification Number
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter TIN (spaces and dashes will be normalized)"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSearch(0)}
                disabled={loading || !searchValue.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Search className="h-4 w-4 mr-2" />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {searchValue && (
              <p className="mt-2 text-sm text-gray-500">
                Normalized: {normalizeTIN(searchValue)}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="prefixSearch"
              checked={prefixSearch}
              onChange={(e) => setPrefixSearch(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="prefixSearch"
              className="ml-2 block text-sm text-gray-700"
            >
              Enable prefix search (startsWith)
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Search Results ({results.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TIN (Normalized)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Person/Org
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jurisdiction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Record ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Searching...
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No results found. Try a different search term or enable prefix
                    search.
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {result.tin_normalized}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.person_or_org || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.jurisdiction || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.reporting_period || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      {result.record_id.substring(0, 8)}...
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {results.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Page {currentPage + 1} {hasMore && '(more results available)'}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleSearch(currentPage - 1)}
                disabled={currentPage === 0 || loading}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handleSearch(currentPage + 1)}
                disabled={!hasMore || loading}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          Privacy Notice
        </h3>
        <p className="text-sm text-blue-700">
          All TIN searches are audited with salted hashes for security purposes.
          Raw TIN values are never logged or stored in audit trails. Search results
          are paginated to 20 records per page.
        </p>
      </div>
    </div>
  );
}
