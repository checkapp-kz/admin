import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // предполагаю, что у вас есть контекст авторизации
import '../styles/Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const { isAdmin, token } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const url = isAdmin ? 
        'http://localhost:3000/reviews/admin/all' : 
        'http://localhost:3000/reviews';
      
      const headers = isAdmin ? {
        'Authorization': `Bearer ${token}`
      } : {};

      const response = await fetch(url, { headers });
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Ошибка при загрузке отзывов:', error);
    }
  };

  const approveReview = async (reviewId) => {
    try {
      await fetch(`http://localhost:3000/reviews/admin/approve/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchReviews();
    } catch (error) {
      console.error('Ошибка при одобрении отзыва:', error);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await fetch(`http://localhost:3000/reviews/admin/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchReviews();
    } catch (error) {
      console.error('Ошибка при удалении отзыва:', error);
    }
  };

  return (
    <div className="reviews-container">
      <h1>Отзывы</h1>
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review._id} className="review-item">
            <p>{review.text}</p>
            <p>Автор: {review.author}</p>
            {isAdmin && !review.approved && (
              <button onClick={() => approveReview(review._id)}>
                Одобрить
              </button>
            )}
            {isAdmin && (
              <button onClick={() => deleteReview(review._id)}>
                Удалить
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews; 