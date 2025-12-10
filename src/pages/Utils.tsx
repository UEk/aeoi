import { useState, useEffect } from 'react';
import { Trash2, Palette, Moon, Sun, Waves, Trees, Sunset as SunsetIcon, Snowflake, Coffee, Zap, Radio, Flower2, Square, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Theme = 'light' | 'dark' | 'ocean' | 'forest' | 'sunset' | 'midnight' | 'nordic' | 'warm' | 'jonas' | 'cyberpunk' | 'retro' | 'nature' | 'monochrome';

interface ThemeVocabulary {
  themeSection: string;
  themeDescription: string;
  databaseSection: string;
  dangerZone: string;
  purgeButton: string;
  cancelButton: string;
  confirmButton: string;
}

const vocabularies: Record<Theme, ThemeVocabulary> = {
  light: {
    themeSection: 'Visual Theme',
    themeDescription: 'Choose a theme that suits your style. Your selection will be saved automatically.',
    databaseSection: 'Database Management',
    dangerZone: 'Danger Zone',
    purgeButton: 'Purge Database',
    cancelButton: 'Cancel',
    confirmButton: 'Yes, Purge Everything'
  },
  dark: {
    themeSection: 'Appearance Settings',
    themeDescription: 'Select your preferred visual aesthetic. Changes persist across sessions.',
    databaseSection: 'Data Control',
    dangerZone: 'Critical Operations',
    purgeButton: 'Obliterate Database',
    cancelButton: 'Abort',
    confirmButton: 'Confirm Deletion'
  },
  ocean: {
    themeSection: 'WAVE STYLE',
    themeDescription: 'Dive into your preferred aesthetic. Anchored automatically to your profile.',
    databaseSection: 'FLEET MANAGEMENT',
    dangerZone: 'Deep Waters',
    purgeButton: 'Sink Database',
    cancelButton: 'Resurface',
    confirmButton: 'Scuttle All Data'
  },
  forest: {
    themeSection: 'Theme Configuration',
    themeDescription: 'Select theme. Preference stored locally.',
    databaseSection: 'Database Operations',
    dangerZone: 'High Risk Area',
    purgeButton: 'Clear Database',
    cancelButton: 'Cancel',
    confirmButton: 'Execute Purge'
  },
  sunset: {
    themeSection: 'Color Vibes',
    themeDescription: 'Pick your perfect palette and let it glow across your experience.',
    databaseSection: 'Data Horizon',
    dangerZone: 'Burnout Zone',
    purgeButton: 'Incinerate Database',
    cancelButton: 'Cool Down',
    confirmButton: 'Blaze It All'
  },
  midnight: {
    themeSection: 'Interface Mode',
    themeDescription: 'Choose your dimension. Your reality persists eternally.',
    databaseSection: 'Data Void',
    dangerZone: 'Event Horizon',
    purgeButton: 'Erase Existence',
    cancelButton: 'Return',
    confirmButton: 'Delete Reality'
  },
  nordic: {
    themeSection: 'Theme',
    themeDescription: 'Select theme. Saved automatically.',
    databaseSection: 'Database',
    dangerZone: 'Warning',
    purgeButton: 'Purge',
    cancelButton: 'Cancel',
    confirmButton: 'Confirm'
  },
  warm: {
    themeSection: 'Cozy Settings',
    themeDescription: 'Find your comfort zone. We\'ll remember your favorite spot.',
    databaseSection: 'Kitchen Cleanup',
    dangerZone: 'Hot Stove',
    purgeButton: 'Empty Everything',
    cancelButton: 'Keep It',
    confirmButton: 'Clear the Table'
  },
  jonas: {
    themeSection: 'Experience Mode',
    themeDescription: 'Curate your digital environment. Preferences sync seamlessly.',
    databaseSection: 'System Control',
    dangerZone: 'Protected Zone',
    purgeButton: 'Reset System',
    cancelButton: 'Dismiss',
    confirmButton: 'Authorize Reset'
  },
  cyberpunk: {
    themeSection: '>> VISUAL_PROTOCOL',
    themeDescription: 'Jack into your preferred interface. Neural cache updated real-time.',
    databaseSection: '>> DATA_MAINFRAME',
    dangerZone: 'ICE BARRIER',
    purgeButton: 'Nuke Database',
    cancelButton: 'Jack Out',
    confirmButton: 'Execute Wipe'
  },
  retro: {
    themeSection: '★ Style Select ★',
    themeDescription: 'Choose your rad look! Totally saves your pick automatically.',
    databaseSection: '★ Data Arcade ★',
    dangerZone: 'Game Over Zone',
    purgeButton: 'Delete High Scores',
    cancelButton: 'Back',
    confirmButton: 'Reset Console'
  },
  nature: {
    themeSection: 'Visual Ecosystem',
    themeDescription: 'Cultivate your environment. Your preference takes root naturally.',
    databaseSection: 'Garden Management',
    dangerZone: 'Wildfire Zone',
    purgeButton: 'Clear the Garden',
    cancelButton: 'Preserve',
    confirmButton: 'Uproot Everything'
  },
  monochrome: {
    themeSection: 'THEME',
    themeDescription: 'SELECT. SAVE. DONE.',
    databaseSection: 'DATABASE',
    dangerZone: 'CRITICAL',
    purgeButton: 'DELETE',
    cancelButton: 'NO',
    confirmButton: 'YES DELETE ALL'
  }
};

interface ThemeOption {
  id: Theme;
  name: string;
  description: string;
  icon: typeof Sun;
  preview: string;
  colors: {
    bg: string;
    accent: string;
    text: string;
  };
}

const themes: ThemeOption[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean and bright',
    icon: Sun,
    preview: 'from-gray-50 to-white',
    colors: { bg: 'bg-gray-50', accent: 'bg-blue-600', text: 'text-gray-900' }
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes',
    icon: Moon,
    preview: 'from-gray-900 to-gray-800',
    colors: { bg: 'bg-gray-900', accent: 'bg-purple-500', text: 'text-white' }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep blue waters',
    icon: Waves,
    preview: 'from-blue-900 to-cyan-700',
    colors: { bg: 'bg-blue-50', accent: 'bg-cyan-600', text: 'text-blue-900' }
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural and calm',
    icon: Trees,
    preview: 'from-green-900 to-emerald-700',
    colors: { bg: 'bg-green-50', accent: 'bg-emerald-600', text: 'text-green-900' }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm and vibrant',
    icon: SunsetIcon,
    preview: 'from-orange-600 to-pink-500',
    colors: { bg: 'bg-orange-50', accent: 'bg-orange-600', text: 'text-orange-900' }
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep and mysterious',
    icon: Moon,
    preview: 'from-slate-900 to-blue-950',
    colors: { bg: 'bg-slate-900', accent: 'bg-blue-400', text: 'text-white' }
  },
  {
    id: 'nordic',
    name: 'Nordic',
    description: 'Cool and minimal',
    icon: Snowflake,
    preview: 'from-slate-100 to-blue-50',
    colors: { bg: 'bg-slate-50', accent: 'bg-slate-600', text: 'text-slate-900' }
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Cozy and inviting',
    icon: Coffee,
    preview: 'from-amber-100 to-orange-100',
    colors: { bg: 'bg-amber-50', accent: 'bg-amber-700', text: 'text-amber-900' }
  },
  {
    id: 'jonas',
    name: 'Jonas',
    description: 'Sophisticated & modern',
    icon: Sparkles,
    preview: 'from-indigo-500 via-purple-500 to-pink-500',
    colors: { bg: 'bg-slate-50', accent: 'bg-indigo-600', text: 'text-slate-900' }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon-soaked future',
    icon: Zap,
    preview: 'from-fuchsia-600 via-cyan-500 to-yellow-400',
    colors: { bg: 'bg-black', accent: 'bg-fuchsia-500', text: 'text-cyan-400' }
  },
  {
    id: 'retro',
    name: 'Retro',
    description: 'Totally 80s vibes',
    icon: Radio,
    preview: 'from-pink-400 via-purple-400 to-blue-400',
    colors: { bg: 'bg-purple-100', accent: 'bg-pink-500', text: 'text-purple-900' }
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Organic & earthy',
    icon: Flower2,
    preview: 'from-lime-600 via-green-500 to-emerald-600',
    colors: { bg: 'bg-stone-100', accent: 'bg-lime-600', text: 'text-stone-900' }
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Brutalist minimalism',
    icon: Square,
    preview: 'from-black via-gray-700 to-gray-500',
    colors: { bg: 'bg-white', accent: 'bg-black', text: 'text-black' }
  }
];

export function Utils() {
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const [purging, setPurging] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  };

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

      setShowPurgeConfirm(false);
      alert('Database purged successfully!');
    } catch (error) {
      console.error('Purge error:', error);
      alert(`Purge failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setPurging(false);
    }
  };

  const vocab = vocabularies[currentTheme];

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Palette className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-900">{vocab.themeSection}</h2>
        </div>
        <p className="text-gray-600 mb-6">
          {vocab.themeDescription}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {themes.map((theme) => {
            const Icon = theme.icon;
            const isActive = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  isActive
                    ? 'border-blue-600 shadow-lg ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`h-20 rounded-md bg-gradient-to-br ${theme.preview} mb-3 flex items-center justify-center`}>
                  <Icon className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{theme.name}</h3>
                <p className="text-sm text-gray-500">{theme.description}</p>
                {isActive && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-blue-600 rounded-full ring-2 ring-white"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Trash2 className="h-6 w-6 text-red-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-900">{vocab.databaseSection}</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-red-800 mb-2">⚠️ {vocab.dangerZone}</h3>
          <p className="text-sm text-red-700">
            These actions are irreversible. Please proceed with caution.
          </p>
        </div>
        <button
          onClick={() => setShowPurgeConfirm(true)}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          <Trash2 className="h-5 w-5 mr-2" />
          {vocab.purgeButton}
        </button>
        <p className="mt-3 text-sm text-gray-500">
          This will permanently delete all files, records, validation errors, and logs from the database.
        </p>
      </div>

      {showPurgeConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-900">Confirm Database Purge</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              This action will permanently delete all data from the database including:
            </p>
            <ul className="text-sm text-gray-600 mb-6 space-y-1 list-disc list-inside">
              <li>All uploaded files and metadata</li>
              <li>All records and account information</li>
              <li>All validation errors and warnings</li>
              <li>All processing logs</li>
            </ul>
            <p className="text-sm font-semibold text-red-600 mb-6">
              This action cannot be undone!
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPurgeConfirm(false)}
                disabled={purging}
                className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
              >
                {vocab.cancelButton}
              </button>
              <button
                onClick={purgeDatabase}
                disabled={purging}
                className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {purging ? 'Processing...' : vocab.confirmButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
