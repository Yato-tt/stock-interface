import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

// options: [{ value, label }]
export default function SelectField({ label, options = [], value, onChange, className = '', disabled = false }) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef(null);

  const selecionado = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const fechar = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAberto(false);
    };
    document.addEventListener('mousedown', fechar);
    document.addEventListener('touchstart', fechar);
    return () => {
      document.removeEventListener('mousedown', fechar);
      document.removeEventListener('touchstart', fechar);
    };
  }, []);

  const handleSelect = (opcao) => {
    onChange?.({ target: { value: opcao.value } });
    setAberto(false);
  };

  return (
    <div className={`mb-2 ${className}`} ref={ref}>
      {label && <label className="text-sm">{label}</label>}

      <div className="relative">
        {/* Botão que simula o select */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setAberto((v) => !v)}
          className={`flex items-center justify-between w-full border border-primary bg-white rounded-lg text-black text-sm px-3 py-2 shadow-lg focus:outline-none focus:ring-1 focus:ring-gray-300 transition
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
        >
          <span className={selecionado?.value === '' ? 'text-gray-400' : 'text-black'}>
            {selecionado?.label || 'Selecione...'}
          </span>
          <ChevronDown
            size={16}
            className={`text-primary transition-transform duration-200 shrink-0 ml-2 ${aberto ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown */}
        {aberto && (
          <ul className="absolute z-50 mt-1 w-full bg-white border border-primary rounded-lg shadow-xl overflow-y-auto max-h-48">
            {options.map((opcao) => (
              <li
                key={opcao.value}
                onMouseDown={() => handleSelect(opcao)}
                className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition
                  ${opcao.value === value
                    ? 'bg-primary text-white font-semibold'
                    : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
                  }`}
              >
                <span>{opcao.label}</span>
                {opcao.value === value && <Check size={14} className="shrink-0" />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
