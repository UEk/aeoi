import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { supabase, AEOIRecord, ValidationError } from '../lib/supabase';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency, formatDate } from '../lib/utils';

export function RecordView() {
  const [records, setRecords] = useState<AEOIRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<AEOIRecord | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [filter, setFilter] = useState<string>('ALL');

  const loadRecords = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('aeoi_record')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter !== 'ALL') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecordErrors = async (recordId: string) => {
    try {
      const { data, error } = await supabase
        .from('validation_error')
        .select('*')
        .eq('record_id', recordId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setErrors(data || []);
    } catch (error) {
      console.error('Error loading record errors:', error);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [filter]);

  useEffect(() => {
    if (selectedRecord) {
      loadRecordErrors(selectedRecord.record_id);
    }
  }, [selectedRecord]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Record Details</h1>
        <p className="mt-1 text-sm text-gray-600">
          View individual records and currency enrichment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Records</h2>
              <div className="flex items-center space-x-3">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="VALIDATED">Validated</option>
                  <option value="FAILED">Failed</option>
                </select>
                <button
                  onClick={loadRecords}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="px-6 py-4 text-center text-sm text-gray-500">
                Loading...
              </div>
            ) : records.length === 0 ? (
              <div className="px-6 py-4 text-center text-sm text-gray-500">
                No records found
              </div>
            ) : (
              records.map((record) => (
                <div
                  key={record.record_id}
                  onClick={() => setSelectedRecord(record)}
                  className={`px-6 py-4 cursor-pointer hover:bg-gray-50 ${
                    selectedRecord?.record_id === record.record_id
                      ? 'bg-blue-50'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {record.doc_ref_id}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {record.jurisdiction || 'N/A'} | Period:{' '}
                        {record.reporting_period || 'N/A'}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 space-y-1">
                      <StatusBadge status={record.status} />
                      <StatusBadge status={record.enrich_status} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          {selectedRecord ? (
            <div>
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Record Details
                </h2>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Doc Ref ID
                    </label>
                    <p className="mt-1 text-sm text-gray-900 break-all">
                      {selectedRecord.doc_ref_id}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Status
                    </label>
                    <div className="mt-1">
                      <StatusBadge status={selectedRecord.status} />
                    </div>
                  </div>
                </div>

                {selectedRecord.corr_doc_ref_id && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Correction Doc Ref ID
                    </label>
                    <p className="mt-1 text-sm text-gray-900 break-all">
                      {selectedRecord.corr_doc_ref_id}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Jurisdiction
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRecord.jurisdiction || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Reporting Period
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRecord.reporting_period || 'N/A'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Person/Organization
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedRecord.person_or_org || 'N/A'}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Currency Information
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">
                        Original Amount
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatCurrency(
                          selectedRecord.amount_original,
                          selectedRecord.currency_original || 'XXX'
                        )}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">
                          SEK
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedRecord.amount_sek
                            ? formatCurrency(selectedRecord.amount_sek, 'SEK')
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">
                          EUR
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedRecord.amount_eur
                            ? formatCurrency(selectedRecord.amount_eur, 'EUR')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">
                        Enrichment Status
                      </label>
                      <div className="mt-1">
                        <StatusBadge status={selectedRecord.enrich_status} />
                      </div>
                    </div>
                  </div>
                </div>

                {errors.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Validation Errors ({errors.length})
                    </h3>
                    <div className="space-y-2">
                      {errors.map((err) => (
                        <div
                          key={err.id}
                          className="p-3 bg-red-50 border border-red-200 rounded-md"
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-medium text-red-700">
                              {err.code}
                            </span>
                            <span className="text-xs text-red-600">
                              {err.level}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-red-700">{err.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 text-xs text-gray-500">
                  <p>Created: {formatDate(selectedRecord.created_at)}</p>
                  <p className="mt-1">
                    Updated: {formatDate(selectedRecord.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-sm text-gray-500">
              Select a record to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
