import React from 'react';
import {Check} from 'lucide-react';
import {STEPS, T} from '../constants.js';

const StepBar = ({current}) => (
    <nav aria-label="Form progress" className="mb-10">
        <ol className="flex items-center">
            {STEPS.map((s, i) => {
                const done = current > s.id;
                const active = current === s.id;
                const Icon = s.icon;
                return (
                    <React.Fragment key={s.id}>
                        <li className="flex flex-col items-center gap-1.5 min-w-[52px]">
                            <div
                                aria-current={active ? 'step' : undefined}
                                style={{
                                    background: done ? T.lime : active ? T.bg600 : T.bg700,
                                    borderColor: done ? T.lime : active ? T.lime : T.border,
                                    color: done ? T.bg900 : active ? T.lime : T.muted,
                                    boxShadow: active ? `0 0 0 3px ${T.limePale}` : 'none',
                                }}
                                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ring-2"
                            >
                                {done ? <Check className="w-4 h-4" strokeWidth={2.5}/> : <Icon className="w-4 h-4"/>}
                            </div>
                            <span
                                style={{color: active ? T.lime : done ? T.muted : T.muted}}
                                className="text-[9px] font-semibold tracking-wider uppercase hidden sm:block"
                            >
                {s.label}
              </span>
                        </li>
                        {i < STEPS.length - 1 && (
                            <div
                                aria-hidden="true"
                                style={{background: done ? T.lime : T.border}}
                                className="flex-1 h-px mx-1 mb-4 transition-all duration-500"
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </ol>
    </nav>
);

export default StepBar;
