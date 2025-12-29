import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'bg-white border border-slate-200 shadow-lg rounded-lg',
          title: 'text-slate-900 font-semibold',
          description: 'text-slate-600',
          actionButton: 'bg-indigo-600 text-white',
          cancelButton: 'bg-slate-100 text-slate-900',
          error: 'bg-red-50 border-red-200',
          success: 'bg-green-50 border-green-200',
          warning: 'bg-amber-50 border-amber-200',
          info: 'bg-blue-50 border-blue-200',
        },
      }}
      richColors
    />
  );
}
