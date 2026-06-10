import React, { useState } from 'react';

interface Props {
  tip: string;
  label: string;
}

export function InfoTooltip({ tip, label }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="w-[14px] h-[14px] text-gray-400 hover:text-gray-600 transition-colors focus:outline-none flex-shrink-0 flex items-center justify-center"
        aria-label={`Help for ${label}`}
      >
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="8" cy="5.5" r="0.75" fill="currentColor" />
          <path d="M8 8v3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <span className="absolute left-5 top-1/2 -translate-y-1/2 z-50 w-64 bg-white border border-gray-200 text-gray-700 text-xs rounded-lg px-3 py-2.5 shadow-lg pointer-events-none leading-relaxed">
          {tip}
        </span>
      )}
    </span>
  );
}

interface FieldLabelProps {
  label: string;
  tip?: string;
}

export function FieldLabel({ label, tip }: FieldLabelProps) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1">
      {label}
      {tip && <InfoTooltip tip={tip} label={label} />}
    </label>
  );
}
