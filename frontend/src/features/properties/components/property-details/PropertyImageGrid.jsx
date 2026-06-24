import React from 'react';

const PropertyImageGrid = ({ gridImages, name }) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-8">
        <div className="md:col-span-2 aspect-[4/3] md:aspect-auto md:h-[400px] overflow-hidden bg-[#1A1D26]">
            <img
                src={gridImages[0]}
                alt={name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
        </div>
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-[400px]">
            {gridImages.slice(1, 5).map((url, i) => (
                <div key={i} className="overflow-hidden bg-[#1A1D26]">
                    <img
                        src={url}
                        alt={`${name} ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                </div>
            ))}
        </div>
    </div>
);

export default PropertyImageGrid;
