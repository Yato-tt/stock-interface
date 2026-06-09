import { Loader2 } from 'lucide-react';

export default function Button({ children, onClick, className, disabled = false, loading = false, noHover = false, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={`bg-primary border-primary text-center shadow-lg transition
        ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : noHover ? '' : 'hover:bg-primary/80'}
        ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          Aguarde...
        </span>
      ) : children}
    </button>
  );
}
