import { useState } from "react";
import { Eye, EyeOff, Plus, Minus } from "lucide-react";

export default function TextField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  className
}) {

  const [showPass, setShowPass] = useState(false);

  const handleInputChange = (e) => {
    let newVal = e.target.value;

    if (type === "number") {
      newVal = Number(newVal);
      if (isNaN(newVal)) newVal = 0;
    }

    onChange?.({ target: { value: newVal } });
  };

  const increment = () => {
    const newVal = Number(value || 0) + 1;
    onChange?.({ target: { value: newVal } });
  };

  const decrement = () => {
    const newVal = Math.max((Number(value) || 0) - 1, 0);
    onChange?.({ target: { value: newVal } });
  };

  const renderAction = () => {
    if (type === "password") {
      return (
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-primary"
        >
          {showPass ? <EyeOff size={12} /> : <Eye size={12} />}
        </button>
      );
    }

    if (type === "number") {
      return (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
          <Plus size={12} onClick={increment} className="cursor-pointer" />
          <Minus size={12} onClick={decrement} className="cursor-pointer" />
        </div>
      );
    }

    return null;
  };

  const inputType =
    type === "password" ? (showPass ? "text" : "password") : type;

  return (
    <div className="mb-2">
      {label && <label className="text-sm">{label}</label>}

      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className={`border border-primary bg-white rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-gray-300 w-full shadow-lg ${className}`}
        />

        {renderAction()}
      </div>
    </div>
  );
}
