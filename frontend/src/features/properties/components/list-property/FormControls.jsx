import {AlertCircle, Check} from 'lucide-react';
import {T} from './constants';
import {clamp} from './utils';

export const Label = ({children, required, htmlFor}) => (
    <label
        htmlFor={htmlFor}
        style={{color: T.text}}
        className="block text-sm font-semibold mb-1.5"
    >
        {children}
        {required && <span style={{color: T.danger}} className="ml-0.5" aria-hidden="true"> *</span>}
    </label>
);

const inputBase = {
    background: T.bg600,
    color: T.text,
    border: `1px solid ${T.border}`,
};

export const Input = ({className = '', id, style = {}, ...props}) => (
    <input
        id={id}
        style={{...inputBase, ...style}}
        className={`w-full px-4 py-3 text-sm rounded-xl outline-none transition-all duration-150
      placeholder:opacity-40 focus:ring-2 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
        onFocus={e => {
            e.target.style.borderColor = T.lime;
            e.target.style.boxShadow = `0 0 0 2px ${T.limePale}`;
        }}
        onBlur={e => {
            e.target.style.borderColor = T.border;
            e.target.style.boxShadow = 'none';
        }}
        {...props}
    />
);

export const Textarea = ({className = '', id, ...props}) => (
    <textarea
        id={id}
        style={{...inputBase}}
        className={`w-full px-4 py-3 text-sm rounded-xl outline-none transition-all duration-150
      placeholder:opacity-40 resize-none focus:ring-2 ${className}`}
        onFocus={e => {
            e.target.style.borderColor = T.lime;
            e.target.style.boxShadow = `0 0 0 2px ${T.limePale}`;
        }}
        onBlur={e => {
            e.target.style.borderColor = T.border;
            e.target.style.boxShadow = 'none';
        }}
        {...props}
    />
);

export const Select = ({id, className = '', children, ...props}) => (
    <select
        id={id}
        style={{...inputBase}}
        className={`w-full px-4 py-3 text-sm rounded-xl outline-none appearance-none cursor-pointer
      focus:ring-2 ${className}`}
        onFocus={e => {
            e.target.style.borderColor = T.lime;
            e.target.style.boxShadow = `0 0 0 2px ${T.limePale}`;
        }}
        onBlur={e => {
            e.target.style.borderColor = T.border;
            e.target.style.boxShadow = 'none';
        }}
        {...props}
    >
        {children}
    </select>
);

export const Counter = ({label, sub, value, onChange, min = 0, max = 50, step = 1, id}) => (
    <div
        style={{borderBottom: `1px solid ${T.border}`}}
        className="flex items-center justify-between py-4 last:border-0"
    >
        <div>
            <p id={id} style={{color: T.text}} className="text-sm font-semibold">{label}</p>
            {sub && <p style={{color: T.muted}} className="text-xs mt-0.5">{sub}</p>}
        </div>
        <div className="flex items-center gap-3" role="group" aria-labelledby={id}>
            <button
                type="button"
                onClick={() => onChange(clamp(value - step, min, max))}
                disabled={value <= min}
                aria-label={`Decrease ${label}`}
                style={{borderColor: T.border, color: T.muted, background: T.bg700}}
                className="w-9 h-9 rounded-full border flex items-center justify-center
          hover:border-lime-400 transition-all duration-150
          disabled:opacity-30 disabled:cursor-not-allowed font-bold text-lg leading-none"
                onMouseEnter={e => {
                    e.currentTarget.style.borderColor = T.lime;
                    e.currentTarget.style.color = T.lime;
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.color = T.muted;
                }}
            >−
            </button>
            <span
                style={{color: T.text}}
                className="w-8 text-center text-sm font-bold tabular-nums"
                aria-live="polite"
                aria-atomic="true"
            >{value}</span>
            <button
                type="button"
                onClick={() => onChange(clamp(value + step, min, max))}
                disabled={value >= max}
                aria-label={`Increase ${label}`}
                style={{borderColor: T.border, color: T.muted, background: T.bg700}}
                className="w-9 h-9 rounded-full border flex items-center justify-center
          transition-all duration-150
          disabled:opacity-30 disabled:cursor-not-allowed font-bold text-lg leading-none"
                onMouseEnter={e => {
                    e.currentTarget.style.borderColor = T.lime;
                    e.currentTarget.style.color = T.lime;
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.color = T.muted;
                }}
            >+
            </button>
        </div>
    </div>
);

export const SelectCard = ({selected, onClick, icon: Icon, label, desc}) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        style={{
            background: selected ? T.limePale : T.bg700,
            borderColor: selected ? T.lime : T.border,
            color: selected ? T.lime : T.text,
        }}
        className="relative flex flex-col gap-2.5 p-4 rounded-2xl border-2 text-left
      transition-all duration-150 focus-visible:outline-none focus-visible:ring-2"
    >
        {selected && (
            <span
                style={{background: T.lime}}
                className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                aria-hidden="true"
            >
        <Check className="w-3 h-3" style={{color: T.bg900}} strokeWidth={2.5}/>
      </span>
        )}
        {Icon && (
            <div
                style={{background: selected ? T.limePale : T.bg600}}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
            >
                <Icon className="w-5 h-5" style={{color: selected ? T.lime : T.muted}}/>
            </div>
        )}
        <p className="text-sm font-semibold">{label}</p>
        {desc && <p style={{color: T.muted}} className="text-xs leading-snug">{desc}</p>}
    </button>
);

export const Section = ({title, desc, children, className = ''}) => (
    <div className={`mb-8 ${className}`}>
        {title && <h3 style={{color: T.text}} className="text-base font-semibold mb-0.5">{title}</h3>}
        {desc && <p style={{color: T.muted}} className="text-sm mb-4">{desc}</p>}
        {children}
    </div>
);

export const FieldError = ({children, id}) => (
    <p id={id} role="alert" style={{color: T.danger}} className="flex items-center gap-1.5 text-xs mt-1.5 font-medium">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true"/>
        {children}
    </p>
);
