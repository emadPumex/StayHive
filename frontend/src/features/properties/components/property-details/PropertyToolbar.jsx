import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';

const PropertyToolbar = ({ isLiked, onToggleLike }) => (
    <div className="flex items-center justify-between mb-5">
        <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#8A8FA8] hover:text-[#C8FB4C] transition-colors"
        >
            <ArrowLeft className="w-4 h-4" /> Back to explore
        </Link>
        <div className="flex items-center gap-2">
            <button
                onClick={onToggleLike}
                className="p-2 border border-[#2A2D38] bg-[#1A1D26] hover:border-[#8A8FA8] rounded-xl transition-colors cursor-pointer"
            >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-[#8A8FA8]'}`} />
            </button>
            <button className="p-2 border border-[#2A2D38] bg-[#1A1D26] hover:border-[#8A8FA8] rounded-xl transition-colors text-[#8A8FA8] cursor-pointer">
                <Share2 className="w-4 h-4" />
            </button>
        </div>
    </div>
);

export default PropertyToolbar;
