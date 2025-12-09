import { useState, useEffect } from 'react';
import { Upload, RefreshCw, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { supabase, FileReceipt } from '../lib/supabase';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate, generateCorrelationId } from '../lib/utils';

export function FileOverview() {
  const [files, setFiles] = useState<FileReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<string>('ALL');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const [purging, setPurging] = useState(false);

  const loadFiles = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('file_receipt')
        .select('*')
        .order('received_at', { ascending: false });

      if (filter !== 'ALL') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [filter]);

  const purgeDatabase = async () => {
    setPurging(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/purge-database`;
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Purge failed');
      }

      alert('Database purged successfully');
      setShowPurgeConfirm(false);
      loadFiles();
    } catch (error) {
      console.error('Purge error:', error);
      alert(`Purge failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setPurging(false);
    }
  };

  const processFile = async (fileId: string, xmlContent: string, correlationId: string) => {
    try {
      console.log('Processing file:', fileId);

      await supabase
        .from('file_receipt')
        .update({ status: 'VALIDATING', updated_at: new Date().toISOString() })
        .eq('file_id', fileId);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await supabase
        .from('file_receipt')
        .update({ status: 'TRANSFORMING', updated_at: new Date().toISOString() })
        .eq('file_id', fileId);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const reportingPeriodMatch = xmlContent.match(/<crs:ReportingPeriod[^>]*>(\d{4})-/i);
      const reportingYear = reportingPeriodMatch ? parseInt(reportingPeriodMatch[1]) : 2023;

      const accountReports = xmlContent.match(/<crs:AccountReport[^>]*>[\s\S]*?<\/crs:AccountReport>/gi) || [];
      console.log('Found account reports:', accountReports.length);

      if (accountReports && accountReports.length > 0) {
        for (const reportXml of accountReports) {
          const docRefIdMatch = reportXml.match(/<stf:DocRefId[^>]*>([^<]+)<\/stf:DocRefId>/i);
          const docRefId = docRefIdMatch ? docRefIdMatch[1].trim() : `DOC-${Math.random().toString(36).substring(7)}`;

          const tinMatch = reportXml.match(/<crs:TIN[^>]*>([^<]+)<\/crs:TIN>/i);
          const tin = tinMatch ? tinMatch[1].trim() : `TIN-${Math.random().toString(36).substring(7)}`;

          const firstNameMatch = reportXml.match(/<crs:FirstName[^>]*>([^<]+)<\/crs:FirstName>/i);
          const lastNameMatch = reportXml.match(/<crs:LastName[^>]*>([^<]+)<\/crs:LastName>/i);
          const firstName = firstNameMatch ? firstNameMatch[1].trim() : '';
          const lastName = lastNameMatch ? lastNameMatch[1].trim() : '';

          const balanceMatch = reportXml.match(/<crs:AccountBalance[^>]*currCode="([A-Z]{3})"[^>]*>([0-9.]+)<\/crs:AccountBalance>/i);
          const currency = balanceMatch ? balanceMatch[1] : 'EUR';
          const amount = balanceMatch ? parseFloat(balanceMatch[2]) : 100000;

          const { data: rateData } = await supabase
            .from('currency_rate')
            .select('sek_per_eur')
            .eq('year', reportingYear)
            .maybeSingle();

          const rate = rateData ? parseFloat(rateData.sek_per_eur) : 10.55;

          let amountSEK = null;
          let amountEUR = null;
          let enrichStatus = 'NOT_CONVERTED';

          if (currency === 'EUR') {
            amountEUR = amount;
            amountSEK = Math.round(amount * rate * 100) / 100;
            enrichStatus = 'CONVERTED';
          } else if (currency === 'SEK') {
            amountSEK = amount;
            amountEUR = Math.round((amount / rate) * 100) / 100;
            enrichStatus = 'CONVERTED';
          }

          const { data: duplicateRecordCheck } = await supabase
            .from('aeoi_record')
            .select('record_id')
            .eq('doc_ref_id', docRefId)
            .maybeSingle();

          if (duplicateRecordCheck) {
            await supabase.from('validation_error').insert({
              file_id: fileId,
              code: '80000',
              message: `Duplicate DocRefId detected: ${docRefId} (Validation Rule 80000 - Blocking)`,
              level: 'ERROR',
            });
          }

          const { data: recordData, error: recordError } = await supabase
            .from('aeoi_record')
            .insert({
              file_id: fileId,
              doc_ref_id: docRefId,
              jurisdiction: 'SE',
              reporting_period: reportingYear,
              amount_original: amount,
              currency_original: currency,
              amount_sek: amountSEK,
              amount_eur: amountEUR,
              enrich_status: enrichStatus,
              status: 'VALIDATED',
              person_or_org: 'Individual',
              tin_original: tin,
            })
            .select()
            .single();

          if (recordError) {
            console.error('Record insert error:', recordError);
          }

          if (recordData && tin) {
            const normalizedTin = tin.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            const { data: caseData } = await supabase
              .from('aeoi_case')
              .select('case_id')
              .eq('file_id', fileId)
              .maybeSingle();

            const { error: tinError } = await supabase.from('tin_index').insert({
              tin_normalized: normalizedTin,
              record_id: recordData.record_id,
              person_or_org: 'Individual',
              jurisdiction: 'SE',
              reporting_period: reportingYear,
              case_id: caseData?.case_id,
            });

            if (tinError) {
              console.error('TIN index error:', tinError);
            }
          }
        }
      }

      const { data: allErrors } = await supabase
        .from('validation_error')
        .select('*')
        .eq('file_id', fileId)
        .eq('level', 'ERROR');

      const hasBlockingErrors = allErrors && allErrors.length > 0;

      await supabase
        .from('file_receipt')
        .update({
          status: hasBlockingErrors ? 'FAILED' : 'COMPLETED',
          updated_at: new Date().toISOString()
        })
        .eq('file_id', fileId);

      await supabase.from('audit_log').insert({
        correlation_id: correlationId,
        actor_id: 'anonymous',
        action: 'TRANSFORM',
        details: { fileId, recordsCreated: accountReports.length, hasErrors: hasBlockingErrors },
      });

      if (hasBlockingErrors) {
        const { data: caseData } = await supabase
          .from('aeoi_case')
          .select('case_id')
          .eq('file_id', fileId)
          .maybeSingle();

        if (caseData) {
          const errorSummary = allErrors.map(e => `${e.code}: ${e.message}`).join('\n');
          await supabase.from('aeoi_task').insert({
            case_id: caseData.case_id,
            type: 'VALIDATION_ERROR',
            status: 'OPEN',
            comments: `File has ${allErrors.length} blocking validation error(s):\n${errorSummary}`,
          });
        }
      }

      console.log('Processing complete for file:', fileId);
      loadFiles();
    } catch (error) {
      console.error('Processing error for file', fileId, ':', error);
      await supabase
        .from('file_receipt')
        .update({ status: 'FAILED', updated_at: new Date().toISOString() })
        .eq('file_id', fileId);

      const { data: caseData } = await supabase
        .from('aeoi_case')
        .select('case_id')
        .eq('file_id', fileId)
        .maybeSingle();

      if (caseData) {
        await supabase.from('aeoi_task').insert({
          case_id: caseData.case_id,
          type: 'PROCESSING_ERROR',
          status: 'OPEN',
          comments: `Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }

      loadFiles();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert('File size must be less than 20 MB');
        return;
      }
      if (!file.name.endsWith('.xml')) {
        alert('Please select an XML file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const correlationId = generateCorrelationId();
      const content = await selectedFile.text();

      const messageRefId = extractMessageRefId(content);
      const jurisdiction = extractJurisdiction(content);
      const reportingPeriod = extractReportingPeriod(content);
      const action = extractMessageTypeIndic(content);
      const blobPath = `uploads/${correlationId}/${selectedFile.name}`;

      const { data: fileData, error: fileError } = await supabase
        .from('file_receipt')
        .insert({
          source: 'UPLOAD',
          original_blob_path: blobPath,
          message_ref_id: `MSGREF-${correlationId}`,
          original_message_ref_id: messageRefId,
          status: 'RECEIVED',
          correlation_id: correlationId,
          file_size_bytes: selectedFile.size,
          jurisdiction: jurisdiction,
          reporting_period: reportingPeriod,
          doc_type_indicator: action,
        })
        .select()
        .single();

      if (fileError) throw fileError;

      const { error: caseError } = await supabase.from('aeoi_case').insert({
        file_id: fileData.file_id,
        status: 'OPEN',
        received_at: new Date().toISOString(),
        source: 'UPLOAD',
        jurisdiction: jurisdiction,
        reporting_period: reportingPeriod,
        doc_type_indicator: action,
      });

      if (caseError) throw caseError;

      const validationErrors = [];

      if (content.includes('--') || content.includes('/*') || content.includes('&#')) {
        validationErrors.push({
          file_id: fileData.file_id,
          code: '50005',
          message: 'Threat scan failed: forbidden sequence detected (Validation Rule 50005 - Blocking)',
          level: 'ERROR',
        });
      }

      if (!messageRefId) {
        validationErrors.push({
          file_id: fileData.file_id,
          code: '50009',
          message: 'MessageRefId could not be extracted from XML (Validation Rule 50009 - Blocking)',
          level: 'ERROR',
        });
      } else {
        const { data: duplicateCheck } = await supabase
          .from('file_receipt')
          .select('file_id')
          .eq('original_message_ref_id', messageRefId)
          .neq('file_id', fileData.file_id)
          .maybeSingle();

        if (duplicateCheck) {
          validationErrors.push({
            file_id: fileData.file_id,
            code: '50009',
            message: `Duplicate MessageRefId detected: ${messageRefId} (Validation Rule 50009 - Blocking)`,
            level: 'ERROR',
          });
        }
      }

      if (!jurisdiction) {
        validationErrors.push({
          file_id: fileData.file_id,
          code: '50012',
          message: 'ReceivingCountry could not be extracted from XML (Validation Rule 50012)',
          level: 'WARNING',
        });
      }

      if (!action) {
        validationErrors.push({
          file_id: fileData.file_id,
          code: 'MISSING_DOC_TYPE',
          message: 'MessageTypeIndic could not be extracted from XML',
          level: 'WARNING',
        });
      }

      if (validationErrors.length > 0) {
        await supabase.from('validation_error').insert(validationErrors);
      }

      await supabase.from('audit_log').insert({
        correlation_id: correlationId,
        actor_id: 'anonymous',
        action: 'UPLOAD',
        details: {
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileId: fileData.file_id,
        },
      });

      alert('File uploaded successfully! Processing...');
      setSelectedFile(null);
      loadFiles();

      processFile(fileData.file_id, content, correlationId);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const extractMessageRefId = (xmlContent: string): string | null => {
    const match = xmlContent.match(/<crs:MessageRefId[^>]*>([^<]+)<\/crs:MessageRefId>/i);
    return match ? match[1].trim() : null;
  };

  const extractJurisdiction = (xmlContent: string): string | null => {
    const match = xmlContent.match(/<crs:ReceivingCountry[^>]*>([^<]+)<\/crs:ReceivingCountry>/i);
    return match ? match[1].trim() : null;
  };

  const extractReportingPeriod = (xmlContent: string): number | null => {
    const match = xmlContent.match(/<crs:ReportingPeriod[^>]*>(\d{4})-/i);
    return match ? parseInt(match[1]) : null;
  };

  const extractMessageTypeIndic = (xmlContent: string): string | null => {
    const match = xmlContent.match(/<crs:MessageTypeIndic[^>]*>([^<]+)<\/crs:MessageTypeIndic>/i);
    return match ? match[1].trim() : null;
  };

  const getFileStats = () => {
    return {
      total: files.length,
      completed: files.filter((f) => f.status === 'COMPLETED').length,
      failed: files.filter((f) => f.status === 'FAILED').length,
      processing: files.filter((f) =>
        ['RECEIVED', 'VALIDATING', 'TRANSFORMING'].includes(f.status)
      ).length,
    };
  };

  const stats = getFileStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">File Overview</h1>
        <p className="mt-1 text-sm text-gray-600">
          Upload and manage DAC2/CRS XML files
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Files
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats.completed}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <RefreshCw className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Processing
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats.processing}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Failed
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats.failed}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Upload XML File</h2>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".xml"
            onChange={handleFileSelect}
            className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button
            onClick={() => setShowPurgeConfirm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Purge Database
          </button>
        </div>
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-500">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      {showPurgeConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Purge Database</h3>
            <p className="text-sm text-gray-600 mb-6">
              This action will permanently delete all files, records, and logs from the database. This cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPurgeConfirm(false)}
                disabled={purging}
                className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={purgeDatabase}
                disabled={purging}
                className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {purging ? 'Purging...' : 'Purge'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Files</h2>
            <div className="flex items-center space-x-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="RECEIVED">Received</option>
                <option value="VALIDATING">Validating</option>
                <option value="TRANSFORMING">Transforming</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
              </select>
              <button
                onClick={loadFiles}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message Ref ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jurisdiction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Received
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : files.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No files found
                  </td>
                </tr>
              ) : (
                files.map((file) => (
                  <tr key={file.file_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {file.original_message_ref_id || <span className="text-red-600">Missing</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={file.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.jurisdiction || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.reporting_period || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(file.received_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {file.status === 'RECEIVED' && (
                        <button
                          onClick={async () => {
                            setProcessingId(file.file_id);
                            const xmlContent = `<dummy>${file.message_ref_id}</dummy>`;
                            await processFile(file.file_id, xmlContent, file.correlation_id);
                            setProcessingId(null);
                          }}
                          disabled={processingId === file.file_id}
                          className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          {processingId === file.file_id ? 'Processing...' : 'Process'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
