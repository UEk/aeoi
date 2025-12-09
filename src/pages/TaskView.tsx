import { useState, useEffect } from 'react';
import { RefreshCw, MessageSquare, Download } from 'lucide-react';
import { supabase, AEOITask, ValidationError } from '../lib/supabase';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate } from '../lib/utils';

export function TaskView() {
  const [tasks, setTasks] = useState<AEOITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<AEOITask | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [comment, setComment] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('aeoi_task')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadErrors = async (taskId: string) => {
    try {
      const { data: taskData } = await supabase
        .from('aeoi_task')
        .select('case_id')
        .eq('task_id', taskId)
        .single();

      if (!taskData) return;

      const { data: caseData } = await supabase
        .from('aeoi_case')
        .select('file_id')
        .eq('case_id', taskData.case_id)
        .single();

      if (!caseData) return;

      const { data, error } = await supabase
        .from('validation_error')
        .select('*')
        .eq('file_id', caseData.file_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setErrors(data || []);
    } catch (error) {
      console.error('Error loading errors:', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (selectedTask) {
      loadErrors(selectedTask.task_id);
    }
  }, [selectedTask]);

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('aeoi_task')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('task_id', taskId);

      if (error) throw error;
      loadTasks();
      alert('Task status updated successfully');
    } catch (error: any) {
      alert(`Failed to update task: ${error.message}`);
    }
  };

  const handleAddComment = async () => {
    if (!selectedTask || !comment.trim()) return;

    try {
      const existingComments = selectedTask.comments || '';
      const timestamp = new Date().toISOString();
      const newComment = `[${timestamp}] anonymous: ${comment}\n`;

      const { error } = await supabase
        .from('aeoi_task')
        .update({
          comments: existingComments + newComment,
          updated_at: new Date().toISOString(),
        })
        .eq('task_id', selectedTask.task_id);

      if (error) throw error;

      setComment('');
      loadTasks();
      const updatedTask = tasks.find((t) => t.task_id === selectedTask.task_id);
      if (updatedTask) {
        setSelectedTask({ ...updatedTask, comments: existingComments + newComment });
      }
    } catch (error: any) {
      alert(`Failed to add comment: ${error.message}`);
    }
  };

  const exportErrorsCSV = () => {
    if (errors.length === 0) {
      alert('No errors to export');
      return;
    }

    const headers = ['Code', 'Message', 'Level', 'Record ID', 'Created At'];
    const rows = errors.map((err) => [
      err.code,
      err.message,
      err.level,
      err.record_id || 'File-level',
      err.created_at,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation-errors-${selectedTask?.task_id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Review and manage validation tasks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Tasks</h2>
              <button
                onClick={loadTasks}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="px-6 py-4 text-center text-sm text-gray-500">
                Loading...
              </div>
            ) : tasks.length === 0 ? (
              <div className="px-6 py-4 text-center text-sm text-gray-500">
                No tasks found
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.task_id}
                  onClick={() => setSelectedTask(task)}
                  className={`px-6 py-4 cursor-pointer hover:bg-gray-50 ${
                    selectedTask?.task_id === task.task_id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {task.type}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Created: {formatDate(task.created_at)}
                      </p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          {selectedTask ? (
            <div>
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Task Details</h2>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) =>
                      handleUpdateStatus(selectedTask.task_id, e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedTask.type}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Validation Errors ({errors.length})
                  </label>
                  <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md">
                    {errors.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No errors found
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {errors.map((err) => (
                          <div key={err.id} className="px-4 py-3">
                            <div className="flex items-start justify-between">
                              <span className="text-xs font-medium text-red-700">
                                {err.code}
                              </span>
                              <span className="text-xs text-gray-500">
                                {err.level}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-700">{err.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.length > 0 && (
                    <button
                      onClick={exportErrorsCSV}
                      className="mt-2 inline-flex items-center px-3 py-1.5 text-sm text-blue-700 hover:text-blue-800"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export CSV
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Comments</label>
                  {selectedTask.comments && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
                      {selectedTask.comments}
                    </div>
                  )}
                  <div className="mt-2 flex space-x-2">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!comment.trim()}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-sm text-gray-500">
              Select a task to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
