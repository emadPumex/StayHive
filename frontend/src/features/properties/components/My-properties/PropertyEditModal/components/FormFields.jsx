import React from 'react';

export const FieldLabel = ({children}) => (
    <label className="text-[10px] font-bold text-[#8A8FA8] uppercase tracking-widest">
        {children}
    </label>
);

export const FieldError = ({msg}) =>
    msg ? <p className="text-[11px] font-semibold text-rose-400 mt-0.5">{msg}</p> : null;

export const TextInput = ({value, onChange, placeholder, className = ''}) => (
    <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-4 py-2.5 bg-[#13161F] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-xl text-sm text-[#FAFAF8] font-medium transition-colors duration-200 w-full ${className}`}
    />
);

export const SelectInput = ({value, onChange, children, className = ''}) => (
    <select
        value={value}
        onChange={onChange}
        className={`px-3.5 py-2.5 bg-[#13161F] border border-[#2A2D38] focus:border-[#C8FB4C] focus:outline-none rounded-xl text-xs text-[#FAFAF8] font-semibold transition-colors duration-200 w-full ${className}`}
    >
        {children}
    </select>
);

export const CounterField = ({label, icon: Icon, value, onChange, min = 0, max = 50}) => (
    <div className="flex flex-col gap-1.5">
        <FieldLabel>{label}</FieldLabel>
        <div className="flex items-center gap-2 px-3 py-2 bg-[#13161F] border border-[#2A2D38] rounded-xl">
            <Icon className="w-3.5 h-3.5 text-[#8A8FA8] shrink-0"/>
            <button
                type="button"
                onClick={() => onChange(Math.max(min, value - 1))}
                className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#1A1D26] hover:bg-[#2A2D38] text-[#8A8FA8] hover:text-[#FAFAF8] font-bold text-sm transition-colors cursor-pointer select-none"
            >
                −
            </button>
            <span className="flex-1 text-center text-sm font-bold text-[#FAFAF8] tabular-nums">{value}</span>
            <button
                type="button"
                onClick={() => onChange(Math.min(max, value + 1))}
                className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#1A1D26] hover:bg-[#2A2D38] text-[#8A8FA8] hover:text-[#FAFAF8] font-bold text-sm transition-colors cursor-pointer select-none"
            >
                +
            </button>
        </div>
    </div>
);

export const SectionHeader = ({children, right = null}) => (
    <div className="flex items-center gap-3">
        <span
            className="text-[10px] font-black text-[#8A8FA8] uppercase tracking-widest whitespace-nowrap">{children}</span>
        <div className="flex-1 h-px bg-[#1A1D26]"/>
        {right}
    </div>
);