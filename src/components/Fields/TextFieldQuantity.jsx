import { Plus, Minus } from "lucide-react";

export default function TextFieldQuantity({ label, value, onChange, className }) {
  const handleChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); // Remove não-dígitos
    val = val === '' ? '0' : String(parseInt(val, 10));
    onChange?.({ target: { value: val } });
  };

  const increment = () => {
    const newVal = (parseInt(value, 10) || 0) + 1;
    onChange?.({ target: { value: String(newVal) } });
  };

  const decrement = () => {
    const newVal = Math.max((parseInt(value, 10) || 0) - 1, 0);
    onChange?.({ target: { value: String(newVal) } });
  };

  return (
    <div className="mb-2">
      {label && <label className="text-sm">{label}</label>}
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={value}
          onChange={handleChange}
          className={`border border-primary bg-white rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-gray-300 w-full shadow-lg ${className}`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
          <Plus size={12} onClick={increment} className="cursor-pointer text-primary" />
          <Minus size={12} onClick={decrement} className="cursor-pointer text-primary" />
        </div>
      </div>
    </div>
  );
}
