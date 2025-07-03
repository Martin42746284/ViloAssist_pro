import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Testimonial } from '@/types/database';

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/api/testimonials');
      setTestimonials(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des témoignages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return {
    testimonials,
    isLoading,
    refetch: fetchTestimonials,
  };
};
