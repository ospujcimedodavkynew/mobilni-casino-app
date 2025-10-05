import React from 'react';
import { CalendarIcon } from './icons/CalendarIcon';
import { ListIcon } from './icons/ListIcon';

export type ViewMode = 'list' | 'calendar';

interface ViewSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-md">
        <button
          onClick={() => onViewChange('list')}
          className={`p-2 rounded-md transition-colors ${
            currentView === 'list' ? 'bg-yellow-500 text-slate-900' : 'text-gray-400 hover:bg-slate-700'
          }`}
          title="Zobrazení seznamu"
        >
          <ListIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onViewChange('calendar')}
          className={`p-2 rounded-md transition-colors ${
            currentView === 'calendar' ? 'bg-yellow-500 text-slate-900' : 'text-gray-400 hover:bg-slate-700'
          }`}
          title="Zobrazení kalendáře"
        >
          <CalendarIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ViewSwitcher;
