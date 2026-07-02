import React from 'react';

const CalendarLegend = ({isRoomTarget}) => (
    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
        <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-[#1A1D26] border border-[#2A2D38]"/>
            <span className="text-[#8A8FA8]">Available</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-[#F5C842]">
            <div className="w-3.5 h-3.5 rounded border border-[#F5C842]"
                 style={{background: 'repeating-linear-gradient(45deg, rgba(245,200,66,0.05), rgba(245,200,66,0.05) 2px, rgba(245,200,66,0.15) 2px, rgba(245,200,66,0.15) 4px)'}}/>
            <span>Blocked (click to undo)</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-indigo-400">
            <div className="w-3.5 h-3.5 rounded bg-indigo-600/60"/>
            <span>Blocked by rule (edit below)</span>
        </div>
        {isRoomTarget && (
            <div className="flex items-center gap-1.5 font-bold text-orange-400">
                <div className="w-3.5 h-3.5 rounded bg-orange-600/50"/>
                <span>Blocked property-wide</span>
            </div>
        )}
        <div className="flex items-center gap-1.5 opacity-40">
            <div className="w-3.5 h-3.5 rounded bg-[#12141A]/40"/>
            <span className="text-[#8A8FA8]">Past</span>
        </div>
    </div>
);

export default CalendarLegend;