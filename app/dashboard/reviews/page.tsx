"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface Review {
  _id: string;
  text: string;
  author: string;
  userName: string;
  isApproved: boolean;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const response = await fetch('https://checkapp-back.vercel.app/reviews/admin/all');
      const data = await response.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ошибка при загрузке отзывов:', error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const approveReview = async (reviewId: string) => {
    setActionLoading(reviewId);
    try {
      const response = await fetch(`https://checkapp-back.vercel.app/reviews/admin/approve/${reviewId}`, {
        method: 'PATCH'
      });
      if (response.ok) {
        await fetchReviews();
      }
    } catch (error) {
      console.error('Ошибка при одобрении отзыва:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteReview = async (reviewId: string) => {
    setActionLoading(reviewId + '_delete');
    try {
      const response = await fetch(`https://checkapp-back.vercel.app/reviews/admin/${reviewId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchReviews();
      }
    } catch (error) {
      console.error('Ошибка при удалении отзыва:', error);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const pendingReviews = reviews.filter(review => !review.isApproved);
  const approvedReviews = reviews.filter(review => review.isApproved);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-24" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Отзывы</h1>
        <p className="text-gray-500">Отзывов пока нет</p>
      </div>
    );
  }

  const ReviewCard = ({ review }: { review: Review }) => (
    <div 
      key={review._id} 
      className="p-4 border rounded-lg bg-white shadow-sm"
    >
      <p className="mb-2">{review.text}</p>
      <p className="text-sm text-gray-600 mb-4">
        Автор: <span className="font-medium">{review.userName}</span>
      </p>
      <div className="flex gap-2">
        {!review.isApproved && (
          <Button
            onClick={() => approveReview(review._id)}
            className="bg-green-600 hover:bg-green-700"
            disabled={actionLoading === review._id}
          >
            {actionLoading === review._id ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Одобрение...</>
            ) : (
              'Одобрить'
            )}
          </Button>
        )}
        <Button
          onClick={() => deleteReview(review._id)}
          variant="destructive"
          disabled={actionLoading === review._id + '_delete'}
        >
          {actionLoading === review._id + '_delete' ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Удаление...</>
          ) : (
            'Удалить'
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Отзывы</h1>
      
      {pendingReviews.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-yellow-600">
            Ожидают одобрения ({pendingReviews.length})
          </h2>
          <div className="grid gap-4">
            {pendingReviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        </div>
      )}

      {approvedReviews.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-green-600">
            Одобренные отзывы ({approvedReviews.length})
          </h2>
          <div className="grid gap-4">
            {approvedReviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 