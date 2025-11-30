import { useState, useRef, useEffect } from "react";

export function CustomSelect({ options, value, onChange, placeholder = "Select..." }) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div
      className={`custom-select ${open ? "open" : ""}`}
      ref={selectRef}
      onClick={() => setOpen(!open)}
    >
      <div className="selected">
        {selectedLabel}
        <span className="arrow">▾</span>
      </div>
      <div className="options">
        {options.map((opt) => (
          <div
            key={opt.value}
            className="option"
            onClick={() => handleSelect(opt.value)}
          >
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );
}
