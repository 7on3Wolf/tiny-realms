import React from 'react';

interface MetadataFieldProps {
  label: string;
  required?: boolean;
  htmlFor?: string;
  error?: string;
  hint?: string;
  counter?: { current: number; max: number };
  children: React.ReactNode;
  className?: string;
}

export default function MetadataField({
  label,
  required = false,
  htmlFor,
  error,
  hint,
  counter,
  children,
  className = '',
}: MetadataFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="block text-xs font-semibold uppercase tracking-wider text-[#F5EBDD]"
        >
          {label} {required && <span className="text-[#C69B5A]">*</span>}
        </label>
        {counter && (
          <span
            className={`text-[11px] font-mono ${
              counter.current > counter.max ? 'text-rose-400 font-bold' : 'text-[#CDBCA8]'
            }`}
          >
            {counter.current} / {counter.max}
          </span>
        )}
      </div>

      {children}

      {error ? (
        <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1">
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="text-[11px] text-[#CDBCA8] mt-1">{hint}</p>
      ) : null}
    </div>
  );
}
