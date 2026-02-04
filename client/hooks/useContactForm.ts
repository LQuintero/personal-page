import { useState, useEffect } from 'react';
import { ContactFormData, validateContactForm } from '@/shared/validators/contact.validator';

export interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

export interface UseContactFormReturn {
  formData: ContactFormData;
  isLoading: boolean;
  errors: FormErrors;
  success: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  resetForm: () => void;
  validateField: (fieldName: keyof ContactFormData, value: string) => string | undefined;
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  const validateField = (fieldName: keyof ContactFormData, value: string): string | undefined => {
    const result = validateContactForm({ ...formData, [fieldName]: value });
    if (!result.success) {
      const fieldError = result.error.issues.find(issue => issue.path[0] === fieldName);
      return fieldError?.message;
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Real-time validation for better UX (only show errors after user stops typing)
    if (value.length > 0) {
      const fieldError = validateField(name as keyof ContactFormData, value);
      if (fieldError) {
        setTimeout(() => {
          setErrors(prev => ({
            ...prev,
            [name]: fieldError
          }));
        }, 1000); // Debounce validation
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
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
    setErrors({});

    // Client-side validation before submitting
    const validation = validateContactForm(formData);
    if (!validation.success) {
      const fieldErrors: FormErrors = {};
      validation.error.issues.forEach(issue => {
        const fieldName = issue.path[0] as keyof ContactFormData;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.ok) {
        // Handle field-specific errors from server
        if (data.field) {
          setErrors({ [data.field]: data.error });
        } else {
          throw new Error(data.error || 'Failed to send message');
        }
        return;
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
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    errors,
    success,
    handleChange,
    handleSubmit,
    resetForm,
    validateField
  };
};

