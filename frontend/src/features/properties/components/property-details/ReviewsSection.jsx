import React, { useState, useRef } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitReview, updateReview, deleteReview } from '../../api/propertyApi';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';

/**
 * ReviewsSection owns the local review list and all review interaction state.
 *
 * Props:
 *  initialReviews  — reviews array from the page load
 *  averageRating   — numeric average
 *  hasReviews      — boolean
 *  formattedRating — e.g. "4.3"
 *  user            — auth user object (null if unauthenticated)
 *  propertyId      — string
 *  propertyHostId  — host.hostId string, used to block host self-reviews
 */
const ReviewsSection = ({
    initialReviews = [],
    averageRating = 0,
    hasReviews,
    formattedRating,
    user,
    propertyId,
    propertyHostId,
}) => {
    const [localReviews,  setLocalReviews]  = useState(initialReviews);
    const [reviewRating,  setReviewRating]  = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [isSubmitting,  setIsSubmitting]  = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [editingReview, setEditingReview] = useState(null);   // null = create, object = edit

    const formRef   = useRef(null);
    const location  = useLocation();
    const navigate  = useNavigate();

    const isHost = Boolean(user && propertyHostId && user.id === propertyHostId);

    /* ── scroll form into view when entering edit mode ── */
    const handleEditClick = (review) => {
        setEditingReview(review);
        setReviewRating(review.rating);
        setReviewComment(review.comment);
        setSubmitSuccess(false);
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    };

    const handleCancelEdit = () => {
        setEditingReview(null);
        setReviewRating(0);
        setReviewComment('');
    };

    /* ── submit: handles both create and update ── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (reviewRating === 0) { toast.error('Please select a rating before submitting.'); return; }
        if (reviewComment.trim().length < 10) { toast.error('Please write at least 10 characters.'); return; }

        setIsSubmitting(true);
        try {
            if (editingReview) {
                /* ── UPDATE ── */
                const updated = await updateReview(propertyId, editingReview.id, {
                    rating: reviewRating,
                    comment: reviewComment.trim(),
                });
                setLocalReviews(prev => prev.map(r => r.id === updated.id ? updated : r));
                toast.success('Review updated!');
            } else {
                /* ── CREATE ── */
                const saved = await submitReview(propertyId, {
                    rating: reviewRating,
                    comment: reviewComment.trim(),
                });
                setLocalReviews(prev => [saved, ...prev]);
                toast.success('Review submitted!', { description: 'Thank you for sharing your experience.' });
            }

            setReviewRating(0);
            setReviewComment('');
            setEditingReview(null);
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 4000);
        } catch (err) {
            const msg = err?.response?.data || 'Failed to submit review. Please try again.';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── delete ── */
    const handleDelete = async (reviewId) => {
        try {
            await deleteReview(propertyId, reviewId);
            setLocalReviews(prev => prev.filter(r => r.id !== reviewId));
            // If we were editing this review, exit edit mode
            if (editingReview?.id === reviewId) handleCancelEdit();
            toast.success('Review deleted.');
        } catch (err) {
            const msg = err?.response?.data || 'Failed to delete review.';
            toast.error(msg);
        }
    };

    const handleSignIn = () => {
        localStorage.setItem('auth_redirect', location.pathname);
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
    };

    return (
        <div
            className="rounded-2xl overflow-hidden"
            style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
        >
            {/* ── Section Header ── */}
            <div style={{
                padding: '24px 24px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                justifyContent: 'space-between', gap: '12px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: 'rgba(200,251,76,0.1)',
                        border: '1px solid rgba(200,251,76,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <MessageSquare size={18} style={{ color: '#C8FB4C' }} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FAFAF8', margin: 0 }}>
                            Guest experiences
                        </h3>
                        <p style={{
                            fontSize: '11px', color: '#6B7280', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.08em', margin: '2px 0 0',
                        }}>
                            {localReviews.length} verified {localReviews.length === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>
                </div>

                {hasReviews && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        background: 'rgba(200,251,76,0.08)',
                        border: '1px solid rgba(200,251,76,0.2)',
                        padding: '8px 14px', borderRadius: '12px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Star size={14} style={{ color: '#C8FB4C', fill: '#C8FB4C' }} />
                            <span style={{ fontSize: '18px', fontWeight: 900, color: '#FAFAF8', lineHeight: 1 }}>
                                {formattedRating}
                            </span>
                        </div>
                        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)' }} />
                        <span style={{
                            fontSize: '11px', fontWeight: 700, color: '#C8FB4C',
                            textTransform: 'uppercase', letterSpacing: '0.06em',
                        }}>
                            {averageRating >= 4.5 ? 'Excellent' : averageRating >= 3.5 ? 'Great' : 'Good'}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Reviews Grid / Empty State ── */}
            <div style={{ padding: '20px 24px' }}>
                {localReviews.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '14px',
                        marginBottom: '28px',
                    }}>
                        {localReviews.map((review, i) => (
                            <ReviewCard
                                key={review.id || i}
                                review={review}
                                currentUserId={user?.id}
                                onEdit={handleEditClick}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', textAlign: 'center',
                        padding: '32px', marginBottom: '24px',
                        border: '1px dashed rgba(255,255,255,0.08)',
                        borderRadius: '16px', gap: '12px',
                    }}>
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '16px',
                            background: 'rgba(255,255,255,0.04)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <MessageSquare size={24} style={{ color: '#2A2D38' }} />
                        </div>
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#FAFAF8', margin: '0 0 4px' }}>
                                No reviews yet
                            </p>
                            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, maxWidth: '280px', lineHeight: 1.6 }}>
                                Be the first to share your experience with the StayHive community.
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Write / Edit a Review ── */}
                <div ref={formRef}>
                    <ReviewForm
                        user={user}
                        isHost={isHost}
                        editingReview={editingReview}
                        onCancelEdit={handleCancelEdit}
                        reviewRating={reviewRating}
                        setReviewRating={setReviewRating}
                        reviewComment={reviewComment}
                        setReviewComment={setReviewComment}
                        isSubmitting={isSubmitting}
                        submitSuccess={submitSuccess}
                        onSubmit={handleSubmit}
                        onSignIn={handleSignIn}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReviewsSection;
