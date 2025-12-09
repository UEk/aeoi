import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { FileOverview } from './pages/FileOverview';
import { TaskView } from './pages/TaskView';
import { RecordView } from './pages/RecordView';
import { TINSearch } from './pages/TINSearch';

type Page = 'files' | 'tasks' | 'records' | 'search';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('files');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as Page;
      if (['files', 'tasks', 'records', 'search'].includes(hash)) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('files');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'files':
        return <FileOverview />;
      case 'tasks':
        return <TaskView />;
      case 'records':
        return <RecordView />;
      case 'search':
        return <TINSearch />;
      default:
        return <FileOverview />;
    }
  };

  return <Layout currentPage={currentPage}>{renderPage()}</Layout>;
}

export default App;
