import { ReactNode, useState, useEffect } from 'react';
import { FileText, CheckSquare, Search, List, Settings } from 'lucide-react';
import { Theme, getVocabulary } from '../lib/vocabulary';

interface LayoutProps {
  children: ReactNode;
  currentPage: 'files' | 'tasks' | 'records' | 'search' | 'utils';
}

export function Layout({ children, currentPage }: LayoutProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }

    const handleStorageChange = () => {
      const theme = localStorage.getItem('theme') as Theme;
      if (theme) {
        setCurrentTheme(theme);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(() => {
      const theme = localStorage.getItem('theme') as Theme;
      if (theme && theme !== currentTheme) {
        setCurrentTheme(theme);
      }
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentTheme]);

  const vocab = getVocabulary(currentTheme);

  useEffect(() => {
    const pageNames = {
      files: vocab.navFileOverview,
      tasks: vocab.navTasks,
      records: vocab.navRecords,
      search: vocab.navTINSearch,
      utils: vocab.navUtils
    };
    document.title = `${pageNames[currentPage]} - ${vocab.appTitle}`;
  }, [currentPage, vocab]);

  const navItems = [
    { id: 'files', label: vocab.navFileOverview, icon: FileText, href: '#files' },
    { id: 'tasks', label: vocab.navTasks, icon: CheckSquare, href: '#tasks' },
    { id: 'records', label: vocab.navRecords, icon: List, href: '#records' },
    { id: 'search', label: vocab.navTINSearch, icon: Search, href: '#search' },
    { id: 'utils', label: vocab.navUtils, icon: Settings, href: '#utils' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  {vocab.appTitle}
                </span>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            {vocab.footerText}
          </p>
        </div>
      </footer>
    </div>
  );
}
