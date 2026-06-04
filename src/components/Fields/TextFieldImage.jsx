import { useState, useEffect, useRef } from "react";
import { Download, X } from "lucide-react";
import { toast } from "react-toastify";

const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const TAMANHO_MAX_MB = 5;

export default function TextFieldImage({ label, placeholder = 'Selecione imagem do Produto', onChange, reset = false, disabled = false }) {
  const [prev, setPrev]         = useState(null);
  const [fileName, setFileName] = useState('');
  const inputRef                = useRef(null);

  useEffect(() => {
    if (reset) {
      setPrev(null);
      setFileName('');
    }
  }, [reset]);

  const limpar = () => {
    setPrev(null);
    setFileName('');
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!TIPOS_ACEITOS.includes(file.type)) {
      toast.error(`Formato não suportado. Use: JPEG, PNG, WebP ou GIF.`);
      limpar();
      return;
    }

    const tamanhoMB = file.size / (1024 * 1024);
    if (tamanhoMB > TAMANHO_MAX_MB) {
      toast.error(`A imagem deve ter no máximo ${TAMANHO_MAX_MB}MB.`);
      limpar();
      return;
    }

    setFileName(file.name);
    setPrev(URL.createObjectURL(file));
    onChange?.(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    limpar();
  };

  return (
    <div className="flex flex-col text-center gap-1 w-full">
      {label && <label className="text-sm text-center mt-6 text-black">{label}</label>}

      <div className="relative w-full">
        <input
          ref={inputRef}
          className="absolute inset-0 opacity-0 cursor-pointer z-2 disabled:cursor-not-allowed"
          type="file"
          accept={TIPOS_ACEITOS.join(',')}
          onChange={handleChange}
          disabled={disabled}
        />

        <div className={`flex flex-col border ${
          prev ? 'border-dashed border-green-400 bg-white mx-6 mt-6' : 'border-dashed border-white bg-white mx-6 mt-6'
        } rounded px-3 py-4 flex items-center justify-center gap-2 text-gray-400 bg-transparent hover:bg-gray-50 transition ${
          disabled ? 'opacity-50' : ''
        }`}>
          <Download size={36} className="text-primary" />
          <span className="text-sm truncate w-3/4">{fileName || placeholder}</span>

          {prev && (
            <>
              <img src={prev} alt="Pré-Visualização" className="h-24 w-24 object-cover mb-2" />
              <button
                className="absolute right-4 top-4 z-3 bg-primary text-white border rounded-full hover:text-red-500 transition"
                onClick={handleRemove}
                type="button"
                disabled={disabled}
              >
                <X size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
