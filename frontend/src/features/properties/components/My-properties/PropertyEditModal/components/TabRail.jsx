import React from 'react';
import {TABS} from '../constants';

const TabRail = ({active, onSelect, errorTabs}) => (
    <div
        className="flex md:flex-col gap-1 px-2 py-3 md:w-44 md:shrink-0 md:border-r border-b md:border-b-0 border-[#1A1D26] overflow-x-auto md:overflow-visible bg-[#0B0D12]">
        {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            const hasError = errorTabs.includes(tab.id);
            return (
                <button
                    key={tab.id}
                    type="button"
                    onClick={() => onSelect(tab.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 ${
                        isActive
                            ? 'bg-[#1A2A0A] text-[#C8FB4C] border border-[#C8FB4C]/30'
                            : 'text-[#8A8FA8] hover:text-[#FAFAF8] hover:bg-[#13161F] border border-transparent'
                    }`}
                >
                    <Icon className="w-3.5 h-3.5 shrink-0"/>
                    {tab.label}
                    {hasError && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 ml-auto shrink-0"/>}
                </button>
            );
        })}
    </div>
);

export default TabRail;