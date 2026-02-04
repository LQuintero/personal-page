import { useState, useEffect } from 'react';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface UseContactFormReturn {
  formData: ContactFormData;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  resetForm: () => void;
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  message: ''
};

const SUCCESS_MESSAGE_DURATION = 3000;

export const useContactForm = (): UseContactFormReturn => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setError(null);
    setSuccess(false);
  };

  // Auto-hide success message after duration
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, SUCCESS_MESSAGE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      resetForm();
      setSuccess(true);
    } catch (err) {
      // Sanitize error messages on client side as well for extra security
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (err instanceof Error) {
        const message = err.message.toLowerCase();
        // Only allow specific, safe error messages through
        if (message.includes('too many requests')) {
          errorMessage = 'Too many requests. Please try again later.';
        } else if (message.includes('invalid input') || message.includes('check your information')) {
          errorMessage = 'Please check your information and try again.';
        } else if (message.includes('network') || message.includes('connection')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
        // For any other error, use the generic message set above
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    success,
    handleChange,
    handleSubmit,
    resetForm
  };
};

