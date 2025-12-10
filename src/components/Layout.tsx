import { ReactNode } from 'react';
import { FileText, CheckSquare, Search, List, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: 'files' | 'tasks' | 'records' | 'search' | 'utils';
}

export function Layout({ children, currentPage }: LayoutProps) {
  const navItems = [
    { id: 'files', label: 'File Overview', icon: FileText, href: '#files' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, href: '#tasks' },
    { id: 'records', label: 'Records', icon: List, href: '#records' },
    { id: 'search', label: 'TIN Search', icon: Search, href: '#search' },
    { id: 'utils', label: 'Utils', icon: Settings, href: '#utils' },
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
                  AEOI Exchange Service
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
            AEOI Exchange Service (DAC2/CRS) - MVP Demo
          </p>
        </div>
      </footer>
    </div>
  );
}
