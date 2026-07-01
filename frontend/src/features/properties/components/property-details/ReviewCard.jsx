import React, { useState } from 'react';
import { Star, Pencil, Trash2 } from 'lucide-react';

const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

const getInitials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';


const ReviewCard = ({ review, currentUserId, onEdit, onDelete }) => {
    const displayName  = review.reviewerName || 'Guest';
    const isOwner      = currentUserId && currentUserId === review.userId;
    const [confirming, setConfirming] = useState(false);   // inline delete confirm state

    return (
        <div
            style={{
                padding: '18px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                transition: 'transform 0.25s ease, border-color 0.25s ease',
                position: 'relative',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'rgba(200,251,76,0.2)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
            }}
        >
            {/* ── Reviewer header ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>

                {/* Avatar */}
                {review.reviewerProfileImage ? (
                    <img
                        src={review.reviewerProfileImage}
                        alt={displayName}
                        style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)',
                            flexShrink: 0,
                        }}
                    />
                ) : (
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #C8FB4C, #8ab820)',
                        color: '#0F1117', fontSize: '12px', fontWeight: 900,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, letterSpacing: '-0.5px',
                    }}>
                        {getInitials(displayName)}
                    </div>
                )}

                {/* Name + date */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                        fontSize: '13px', fontWeight: 700, color: '#FAFAF8',
                        margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                        {displayName}
                    </p>
                    <p style={{ fontSize: '10px', color: '#6B7280', fontWeight: 600, margin: '2px 0 0' }}>
                        {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                            : 'Stayed recently'}
                    </p>
                </div>

                {/* Edit / Delete — only visible to the review author */}
                {isOwner && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        {!confirming ? (
                            <>
                                {/* Edit button */}
                                <button
                                    title="Edit review"
                                    onClick={() => onEdit(review)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: '28px', height: '28px', borderRadius: '8px',
                                        background: 'rgba(200,251,76,0.08)',
                                        border: '1px solid rgba(200,251,76,0.15)',
                                        color: '#C8FB4C', cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'rgba(200,251,76,0.18)';
                                        e.currentTarget.style.borderColor = 'rgba(200,251,76,0.35)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'rgba(200,251,76,0.08)';
                                        e.currentTarget.style.borderColor = 'rgba(200,251,76,0.15)';
                                    }}
                                >
                                    <Pencil size={12} />
                                </button>

                                {/* Delete button */}
                                <button
                                    title="Delete review"
                                    onClick={() => setConfirming(true)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: '28px', height: '28px', borderRadius: '8px',
                                        background: 'rgba(239,68,68,0.08)',
                                        border: '1px solid rgba(239,68,68,0.15)',
                                        color: '#EF4444', cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'rgba(239,68,68,0.18)';
                                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)';
                                    }}
                                >
                                    <Trash2 size={12} />
                                </button>
                            </>
                        ) : (
                            /* Inline confirm prompt */
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.2)',
                                borderRadius: '10px', padding: '4px 8px',
                                animation: 'fadeIn 0.15s ease',
                            }}>
                                <span style={{ fontSize: '10px', fontWeight: 700, color: '#EF4444', whiteSpace: 'nowrap' }}>
                                    Delete?
                                </span>
                                <button
                                    onClick={() => { onDelete(review.id); setConfirming(false); }}
                                    style={{
                                        fontSize: '10px', fontWeight: 800, color: '#0F1117',
                                        background: '#EF4444', border: 'none', borderRadius: '6px',
                                        padding: '2px 8px', cursor: 'pointer',
                                    }}
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setConfirming(false)}
                                    style={{
                                        fontSize: '10px', fontWeight: 700, color: '#9CA3AF',
                                        background: 'transparent', border: 'none',
                                        cursor: 'pointer', padding: '2px 4px',
                                    }}
                                >
                                    No
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Star rating ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '10px' }}>
                {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} size={13} style={{
                        color: si < review.rating ? '#C8FB4C' : '#2A2D38',
                        fill: si < review.rating ? '#C8FB4C' : 'transparent',
                    }} />
                ))}
                <span style={{ fontSize: '11px', color: '#C8FB4C', fontWeight: 700, marginLeft: '4px' }}>
                    {ratingLabels[review.rating] || ''}
                </span>
            </div>

            {/* ── Comment ── */}
            <p style={{
                fontSize: '12px', color: '#8A8FA8', lineHeight: 1.65,
                fontStyle: 'italic', margin: 0,
                display: '-webkit-box', WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
                &quot;{review.comment}&quot;
            </p>
        </div>
    );
};

export default ReviewCard;
