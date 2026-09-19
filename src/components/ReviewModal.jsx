import React, { useState } from 'react';
import { Star, X, CheckCircle2, ThumbsUp, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { reviewApi } from '../services/api';

export const ReviewModal = ({ isOpen, onClose, doctor, appointmentId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState(true);
  const [waitTimeRating, setWaitTimeRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a short comment about your consultation');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await reviewApi.createReview({
        doctorId: doctor._id || doctor.id,
        appointmentId,
        rating,
        comment,
        recommend,
        waitTimeRating,
      });

      if (res.data.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        if (onReviewSubmitted) {
          onReviewSubmitted(res.data.review);
        }
        onClose();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <Star className="w-5 h-5 fill-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Rate Your Consultation</h3>
              <p className="text-xs text-teal-100/80">
                {doctor?.userId?.name || doctor?.name || 'Your Doctor'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
              {error}
            </div>
          )}

          {/* Star Rating */}
          <div className="text-center space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Overall Experience Rating
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-slate-700">
              {rating === 5 && '🌟 Outstanding Consultation'}
              {rating === 4 && '👍 Very Good Experience'}
              {rating === 3 && '👌 Satisfactory Care'}
              {rating === 2 && '⚠️ Needs Improvement'}
              {rating === 1 && '👎 Poor Experience'}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Your Feedback / Clinical Experience
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Share details about the doctor's communication, attentiveness, and advice..."
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm resize-none"
            />
          </div>

          {/* Recommend Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-teal-600" />
              Would you recommend this doctor to others?
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRecommend(true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  recommend
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setRecommend(false)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  !recommend
                    ? 'bg-rose-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                No
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Skip / Later
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-sm font-bold rounded-xl shadow-glow-teal flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
