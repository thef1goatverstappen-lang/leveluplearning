import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, CheckCircle, Info, Flame } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let Icon = CheckCircle;
        let borderColor = 'border-purple-200';
        let bgStyle = 'bg-white text-gray-900 shadow-xl';

        if (toast.type === 'streak') {
          Icon = Flame;
          borderColor = 'border-orange-200';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderColor = 'border-blue-200';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl p-4 border ${borderColor} ${bgStyle} flex items-center justify-between gap-3 shadow-lg transform transition-all duration-300 animate-in slide-in-from-bottom-5`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 text-purple-600">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2">
                  {toast.message}
                </p>
              </div>
            </div>

            {toast.xp !== undefined && (
              <div className="shrink-0 flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-heading font-bold text-xs px-2.5 py-1 rounded-full shadow-xs animate-bounce">
                <Sparkles className="w-3.5 h-3.5" />
                +{toast.xp} XP
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
