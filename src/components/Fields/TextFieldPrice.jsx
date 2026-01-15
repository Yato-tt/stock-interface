import { useState } from "react";

export default function TextFieldPrice({ label, value, onChange, className }) {
  const handleChange = (e) => {
    let val = e.target.value;

    // Remove caracteres não numéricos exceto ponto
    val = val.replace(/[^\d.]/g, '');

    // Permite apenas um ponto decimal
    const parts = val.split('.');
    if (parts.length > 2) {
      val = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limita a 2 casas decimais
    if (parts[1] && parts[1].length > 2) {
      val = parts[0] + '.' + parts[1].substring(0, 2);
    }

    onChange?.({ target: { value: val } });
  };

  return (
    <div className="mb-2">
      {label && <label className="text-sm">{label}</label>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={value}
          onChange={handleChange}
          className={`border border-primary bg-white rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-gray-300 w-full shadow-lg pl-10 ${className}`}
        />
      </div>
    </div>
  );
}
