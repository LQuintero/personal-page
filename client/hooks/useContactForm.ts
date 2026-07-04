import { useState, useEffect, useRef } from 'react';
import { ContactFormData, validateContactForm } from '@/shared/validators/contact.validator';

export type FormErrors = Partial<Record<keyof ContactFormData, string>> & { general?: string };

export interface UseContactFormReturn {
  formData: ContactFormData;
  isLoading: boolean;
  errors: FormErrors;
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const validationTimers = useRef<Partial<Record<keyof ContactFormData, ReturnType<typeof setTimeout>>>>({});

  const validateField = (fieldName: keyof ContactFormData, value: string): string | undefined => {
    const result = validateContactForm({ ...formData, [fieldName]: value });
    if (!result.success) {
      const fieldError = result.error.issues.find(
        (issue) => issue.path[0] === fieldName
      );
      return fieldError?.message;
    }
    return undefined;
  };

  const clearValidationTimer = (fieldName: keyof ContactFormData) => {
    const existingTimer = validationTimers.current[fieldName];
    if (existingTimer) {
      clearTimeout(existingTimer);
      delete validationTimers.current[fieldName];
    }
  };

  const clearValidationTimers = () => {
    Object.values(validationTimers.current).forEach((timer) => {
      if (timer) clearTimeout(timer);
    });
    validationTimers.current = {};
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof ContactFormData;

    setFormData((prev: ContactFormData) => ({ ...prev, [name]: value }));

    if (errors[fieldName]) {
      setErrors((prev: FormErrors) => ({ ...prev, [fieldName]: undefined }));
    }

    clearValidationTimer(fieldName);
    if (value.length > 0) {
      validationTimers.current[fieldName] = setTimeout(() => {
        const fieldError = validateField(fieldName, value);
        if (fieldError) {
          setErrors((prev: FormErrors) => ({ ...prev, [fieldName]: fieldError }));
        }
      }, 1000);
    }
  };

  const resetForm = () => {
    clearValidationTimers();
    setFormData(initialFormData);
    setErrors({});
    setSuccess(false);
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), SUCCESS_MESSAGE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    return () => clearValidationTimers();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validation = validateContactForm(formData);
    if (!validation.success) {
      const fieldErrors: FormErrors = {};
      validation.error.issues.forEach((issue) => {
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
      let errorMessage = 'Failed to send message. Please try again.';

      if (err instanceof Error) {
        const message = err.message.toLowerCase();
        if (message.includes('too many requests')) {
          errorMessage = 'Too many requests. Please try again later.';
        } else if (message.includes('invalid input') || message.includes('check your information')) {
          errorMessage = 'Please check your information and try again.';
        } else if (message.includes('network') || message.includes('connection')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
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
  };
};
