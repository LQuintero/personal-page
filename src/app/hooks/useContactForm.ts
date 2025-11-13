import { useState } from 'react';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface UseContactFormReturn {
  formData: ContactFormData;
  isLoading: boolean;
  error: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  resetForm: () => void;
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  message: ''
};

export const useContactForm = (): UseContactFormReturn => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to send message');
      // }

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', formData);
      resetForm();
      
      // Return success - parent component can handle notification
      return;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    resetForm
  };
};

