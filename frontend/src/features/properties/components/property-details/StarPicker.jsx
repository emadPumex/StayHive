import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarPicker = ({ value, onChange, size = 28 }) => {
    const [hovered, setHovered] = useState(0);
    return (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map(n => (
                <button
                    key={n}
                    type="button"
                    onClick={() => onChange(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    style={{
                        background: 'none', border: 'none', padding: 0,
                        cursor: 'pointer', transition: 'transform 0.15s ease',
                        transform: hovered >= n ? 'scale(1.2)' : 'scale(1)',
                    }}
                >
                    <Star
                        size={size}
                        style={{
                            color: (hovered || value) >= n ? '#C8FB4C' : '#2A2D38',
                            fill: (hovered || value) >= n ? '#C8FB4C' : 'transparent',
                            transition: 'color 0.15s ease, fill 0.15s ease',
                            filter: (hovered || value) >= n
                                ? 'drop-shadow(0 0 6px rgba(200,251,76,0.5))'
                                : 'none',
                        }}
                    />
                </button>
            ))}
        </div>
    );
};

export default StarPicker;
