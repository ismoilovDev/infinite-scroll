import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
   message: string;
}

export const ErrorState = ({ message }: ErrorStateProps) => (
   <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-xl shadow-red-500/10 border border-red-100 rounded-3xl p-10 text-center">
         <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
         </div>
         <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-text-primary mb-3">
            Xatolik yuz berdi
         </h3>
         <p className="text-text-secondary text-base mb-8 leading-relaxed">{message}</p>
         <button
            onClick={() => window.location.reload()}
            className="px-8 py-3.5 bg-linear-to-r from-gradient-start to-gradient-end text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 hover:-translate-y-0.5"
         >
            Qayta urinish
         </button>
      </div>
   </div>
);
