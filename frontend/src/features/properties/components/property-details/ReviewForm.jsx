import React from 'react';
import { Lock, CheckCircle2, PenLine, Send, X, Pencil } from 'lucide-react';
import StarPicker from './StarPicker';

const ratingLabels  = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
const ratingColors  = ['', '#EF4444', '#F97316', '#EAB308', '#84CC16', '#C8FB4C'];

const getInitials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

/**
 * ReviewForm handles four display states:
 *  1. Unauthenticated      → sign-in prompt
 *  2. Host of property     → "hosts can't review" notice
 *  3. submitSuccess        → thank-you confirmation
 *  4. Authenticated        → write / edit review form
 *
 * Props:
 *  user            — auth user object (null if unauthenticated)
 *  isHost          — true when user is the property host
 *  editingReview   — review object being edited, or null for new review
 *  onCancelEdit    — callback to exit edit mode
 *  reviewRating / setReviewRating
 *  reviewComment / setReviewComment
 *  isSubmitting / submitSuccess
 *  onSubmit / onSignIn
 */
const ReviewForm = ({
    user,
    isHost,
    editingReview,
    onCancelEdit,
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
    isSubmitting,
    submitSuccess,
    onSubmit,
    onSignIn,
}) => {
    const isEditing = Boolean(editingReview);

    return (
        <div style={{
            marginTop: '8px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '28px',
        }}>

            {/* ── Section heading ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(200,251,76,0.18), rgba(200,251,76,0.06))',
                    border: '1px solid rgba(200,251,76,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                    {isEditing ? <Pencil size={15} style={{ color: '#C8FB4C' }} /> : <PenLine size={15} style={{ color: '#C8FB4C' }} />}
                </div>
                <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#FAFAF8', margin: 0, letterSpacing: '-0.01em' }}>
                        {isEditing ? 'Edit your review' : 'Share your experience'}
                    </h4>
                    <p style={{ fontSize: '11px', color: '#4A5068', fontWeight: 600, margin: '2px 0 0' }}>
                        {isEditing ? 'Update your rating and comment below' : 'Your honest review helps future travelers'}
                    </p>
                </div>
            </div>

            {/* ══════════════════════════════════
                STATE 1 — NOT LOGGED IN
            ══════════════════════════════════ */}
            {!user ? (
                <div style={{
                    padding: '20px 24px',
                    background: 'linear-gradient(135deg, rgba(200,251,76,0.04), rgba(200,251,76,0.01))',
                    border: '1px solid rgba(200,251,76,0.12)',
                    borderRadius: '16px',
                    display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
                }}>
                    <div style={{
                        width: '46px', height: '46px', borderRadius: '14px',
                        background: 'rgba(200,251,76,0.1)',
                        border: '1px solid rgba(200,251,76,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                        <Lock size={20} style={{ color: '#C8FB4C' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: '160px' }}>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#FAFAF8', margin: '0 0 4px' }}>
                            Sign in to leave a review
                        </p>
                        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                            Share your stay and help future guests make informed decisions.
                        </p>
                    </div>
                    <button
                        onClick={onSignIn}
                        style={{
                            padding: '10px 20px',
                            background: '#C8FB4C', color: '#0F1117',
                            fontWeight: 800, fontSize: '12px', letterSpacing: '0.02em',
                            borderRadius: '12px', border: 'none',
                            cursor: 'pointer', flexShrink: 0,
                            boxShadow: '0 4px 14px rgba(200,251,76,0.25)',
                            transition: 'opacity 0.2s ease, transform 0.2s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        Sign in
                    </button>
                </div>

            ) : isHost ? (
                /* ══════════════════════════════════
                    STATE 2 — USER IS THE HOST
                ══════════════════════════════════ */
                <div style={{
                    padding: '20px 24px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    display: 'flex', alignItems: 'center', gap: '16px',
                }}>
                    <div style={{
                        width: '46px', height: '46px', borderRadius: '14px',
                        background: 'rgba(139,92,246,0.1)',
                        border: '1px solid rgba(139,92,246,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        fontSize: '20px',
                    }}>
                        🏠
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#FAFAF8', margin: '0 0 4px' }}>
                            You're the host of this property
                        </p>
                        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                            Hosts can't leave reviews on their own listings to keep things fair for guests.
                        </p>
                    </div>
                </div>

            ) : submitSuccess ? (
                /* ══════════════════════════════════
                    STATE 3 — SUCCESS
                ══════════════════════════════════ */
                <div style={{
                    padding: '32px 24px',
                    background: 'linear-gradient(135deg, rgba(200,251,76,0.08), rgba(200,251,76,0.03))',
                    border: '1px solid rgba(200,251,76,0.25)',
                    borderRadius: '18px',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '12px', textAlign: 'center',
                }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '20px',
                        background: 'rgba(200,251,76,0.12)',
                        border: '1px solid rgba(200,251,76,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <CheckCircle2 size={32} style={{ color: '#C8FB4C' }} />
                    </div>
                    <div>
                        <p style={{ fontSize: '16px', fontWeight: 800, color: '#FAFAF8', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                            {isEditing ? 'Review updated!' : 'Review published!'}
                        </p>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
                            Thank you for helping the StayHive community.
                        </p>
                    </div>
                </div>

            ) : (
                /* ══════════════════════════════════
                    STATE 4 — FORM (create or edit)
                ══════════════════════════════════ */
                <form onSubmit={onSubmit}>

                    {/* Outer form card */}
                    <div style={{
                        background: 'rgba(15, 17, 23, 0.85)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                    }}>

                        {/* User identity strip */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '16px 20px',
                            background: 'rgba(255,255,255,0.03)',
                            borderBottom: '1px solid rgba(255,255,255,0.07)',
                        }}>
                            {user.picture ? (
                                <img
                                    src={user.picture}
                                    alt={user.name}
                                    style={{
                                        width: '36px', height: '36px', borderRadius: '10px',
                                        objectFit: 'cover', flexShrink: 0,
                                        border: '2px solid rgba(200,251,76,0.3)',
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #C8FB4C, #8ab820)',
                                    color: '#0F1117', fontSize: '12px', fontWeight: 900,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, letterSpacing: '-0.5px',
                                    boxShadow: '0 2px 8px rgba(200,251,76,0.3)',
                                }}>
                                    {getInitials(user.name)}
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '13px', fontWeight: 700, color: '#FAFAF8', margin: 0 }}>
                                    {user.name || user.email}
                                </p>
                                <p style={{ fontSize: '10px', color: '#4A5068', margin: '2px 0 0', fontWeight: 600 }}>
                                    {isEditing ? 'Editing your review' : 'Posting as verified guest'}
                                </p>
                            </div>
                            {/* Edit mode badge */}
                            {isEditing && (
                                <div style={{
                                    padding: '4px 10px',
                                    background: 'rgba(200,251,76,0.08)',
                                    border: '1px solid rgba(200,251,76,0.15)',
                                    borderRadius: '20px',
                                    display: 'flex', alignItems: 'center', gap: '5px',
                                }}>
                                    <Pencil size={10} style={{ color: '#C8FB4C' }} />
                                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#A8D44A', letterSpacing: '0.05em' }}>
                                        EDITING
                                    </span>
                                </div>
                            )}
                            {!isEditing && (
                                <div style={{ padding: '4px 10px', background: 'rgba(200,251,76,0.08)', border: '1px solid rgba(200,251,76,0.15)', borderRadius: '20px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#A8D44A', letterSpacing: '0.05em' }}>✓ VERIFIED</span>
                                </div>
                            )}
                        </div>

                        {/* Form body */}
                        <div style={{ padding: '22px 20px 20px' }}>

                            {/* Star rating */}
                            <div style={{ marginBottom: '22px' }}>
                                <p style={{
                                    fontSize: '11px', fontWeight: 700, color: '#6B7280',
                                    textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px',
                                }}>
                                    Your Rating
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                    <StarPicker value={reviewRating} onChange={setReviewRating} size={32} />
                                    {reviewRating > 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                fontSize: '12px', fontWeight: 800,
                                                color: ratingColors[reviewRating],
                                                background: `${ratingColors[reviewRating]}18`,
                                                border: `1px solid ${ratingColors[reviewRating]}35`,
                                                padding: '5px 12px', borderRadius: '20px',
                                                letterSpacing: '0.02em',
                                            }}>
                                                {ratingLabels[reviewRating]}
                                            </span>
                                            <button
                                                type="button"
                                                title="Clear rating"
                                                onClick={() => setReviewRating(0)}
                                                style={{
                                                    background: 'rgba(255,255,255,0.06)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '50%',
                                                    width: '24px', height: '24px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer', color: '#6B7280',
                                                    transition: 'all 0.15s ease', flexShrink: 0,
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Textarea */}
                            <div style={{ marginBottom: '18px' }}>
                                <p style={{
                                    fontSize: '11px', fontWeight: 700, color: '#6B7280',
                                    textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px',
                                }}>
                                    Your Review
                                </p>
                                <div style={{ position: 'relative' }}>
                                    <textarea
                                        value={reviewComment}
                                        onChange={e => setReviewComment(e.target.value)}
                                        placeholder="Describe your experience — what did you love? Any tips for future guests?"
                                        rows={4}
                                        maxLength={600}
                                        style={{
                                            width: '100%', boxSizing: 'border-box',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1.5px solid rgba(255,255,255,0.1)',
                                            borderRadius: '14px', color: '#FAFAF8',
                                            fontSize: '13px', lineHeight: 1.7,
                                            padding: '14px 16px 36px', resize: 'vertical',
                                            outline: 'none',
                                            transition: 'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
                                            fontFamily: "'Outfit', sans-serif",
                                            caretColor: '#C8FB4C',
                                        }}
                                        onFocus={e => {
                                            e.target.style.borderColor = 'rgba(200,251,76,0.5)';
                                            e.target.style.background = 'rgba(255,255,255,0.07)';
                                            e.target.style.boxShadow = '0 0 0 4px rgba(200,251,76,0.07)';
                                        }}
                                        onBlur={e => {
                                            e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                            e.target.style.background = 'rgba(255,255,255,0.05)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute', bottom: '12px', right: '14px',
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        pointerEvents: 'none',
                                    }}>
                                        {reviewComment.length > 0 && (
                                            <div style={{
                                                width: `${Math.min((reviewComment.length / 600) * 28, 28)}px`,
                                                height: '3px', borderRadius: '2px',
                                                background: reviewComment.length > 550 ? '#EF4444' : '#C8FB4C',
                                                opacity: 0.7, transition: 'width 0.2s ease, background 0.2s ease',
                                            }} />
                                        )}
                                        <span style={{
                                            fontSize: '10px',
                                            color: reviewComment.length > 550 ? '#EF4444' : '#4A5068',
                                            fontWeight: 600,
                                        }}>
                                            {reviewComment.length}/600
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons row */}
                            <div style={{ display: 'flex', gap: '10px' }}>

                                {/* Cancel — only in edit mode */}
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={onCancelEdit}
                                        style={{
                                            flex: '0 0 auto',
                                            padding: '14px 20px',
                                            background: 'rgba(255,255,255,0.06)',
                                            color: '#9CA3AF', fontWeight: 700, fontSize: '13px',
                                            borderRadius: '14px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            cursor: 'pointer', transition: 'all 0.2s ease',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#FAFAF8'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#9CA3AF'; }}
                                    >
                                        Cancel
                                    </button>
                                )}

                                {/* Submit / Update */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || reviewRating === 0}
                                    style={{
                                        flex: 1,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        gap: '8px', padding: '14px 20px',
                                        background: reviewRating === 0
                                            ? 'rgba(255,255,255,0.05)'
                                            : isEditing
                                                ? 'linear-gradient(135deg, #C8FB4C, #a8d820)'
                                                : 'linear-gradient(135deg, #C8FB4C, #a8d820)',
                                        color: reviewRating === 0 ? '#4A5068' : '#0F1117',
                                        fontWeight: 800, fontSize: '13px', letterSpacing: '0.01em',
                                        borderRadius: '14px', border: 'none',
                                        cursor: reviewRating === 0 || isSubmitting ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.25s ease',
                                        boxShadow: reviewRating > 0 && !isSubmitting
                                            ? '0 4px 20px rgba(200,251,76,0.3), inset 0 1px 0 rgba(255,255,255,0.25)'
                                            : 'none',
                                    }}
                                    onMouseEnter={e => {
                                        if (reviewRating > 0 && !isSubmitting) {
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                            e.currentTarget.style.boxShadow = '0 6px 24px rgba(200,251,76,0.4), inset 0 1px 0 rgba(255,255,255,0.25)';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        if (reviewRating > 0 && !isSubmitting) {
                                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(200,251,76,0.3), inset 0 1px 0 rgba(255,255,255,0.25)';
                                        }
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full border-2 border-[#0F1117]/30 border-t-[#0F1117]"
                                                style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                            />
                                            {isEditing ? 'Updating…' : 'Submitting…'}
                                        </>
                                    ) : (
                                        <>
                                            <Send size={14} />
                                            {reviewRating === 0
                                                ? 'Select a rating to continue'
                                                : isEditing ? 'Update review' : 'Publish review'}
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ReviewForm;
