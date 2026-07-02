import React from 'react';
import {Home, DoorOpen} from 'lucide-react';

const TargetSelector = ({rooms, target, onSelect}) => (
    <div className="px-6 pt-4 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
        <button
            onClick={() => onSelect({type: 'PROPERTY'})}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all duration-200 shrink-0 ${
                target.type === 'PROPERTY'
                    ? 'bg-[#1A2A0A] border-[#C8FB4C] text-[#C8FB4C]'
                    : 'bg-[#1A1D26]/60 border-[#2A2D38] text-[#8A8FA8] hover:text-[#FAFAF8]'
            }`}
        >
            <Home className="w-3.5 h-3.5"/> Whole Property
        </button>
        {rooms.map(r => (
            <button
                key={r.id}
                onClick={() => onSelect({type: 'ROOM', roomId: r.id})}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all duration-200 shrink-0 ${
                    target.type === 'ROOM' && target.roomId === r.id
                        ? 'bg-[#1A2A0A] border-[#C8FB4C] text-[#C8FB4C]'
                        : 'bg-[#1A1D26]/60 border-[#2A2D38] text-[#8A8FA8] hover:text-[#FAFAF8]'
                }`}
            >
                <DoorOpen className="w-3.5 h-3.5"/> {r.name}
            </button>
        ))}
    </div>
);

export default TargetSelector;