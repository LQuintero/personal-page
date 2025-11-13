'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useContactForm } from '@/hooks/useContactForm';

// Style constants - update these in one place to change styles across the form
const styles = {
  container: 'max-w-3xl mx-auto px-12 py-6',
  form: 'space-y-5 border border-gray-200 rounded-lg shadow-sm bg-white p-8',
  title: 'text-xl font-semibold text-gray-900 mb-6',
  label: 'block text-sm font-medium text-gray-600 mb-1.5',
  input: 'block w-full text-sm border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors',
  textarea: 'block w-full text-sm border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors resize-none',
  button: 'w-full bg-[#41b390] text-white text-base font-medium py-2.5 px-4 rounded-md hover:bg-[#369d7a] disabled:bg-[#41b390]/50 disabled:cursor-not-allowed transition-colors flex items-center justify-center',
  alert: {
    success: 'bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-2.5 rounded mb-4',
    error: 'bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-2.5 rounded mb-4',
  },
};

const ContactForm: React.FC = () => {
  const { formData, isLoading, error, handleChange, handleSubmit } = useContactForm();
  const [showSuccess, setShowSuccess] = useState(false);
  const previousLoadingRef = useRef(false);

  // Watch for successful submission (when loading goes from true to false without error)
  useEffect(() => {
    if (previousLoadingRef.current && !isLoading && !error) {
      // Form was just submitted successfully
      const isFormEmpty = !formData.name && !formData.email && !formData.message;
      if (isFormEmpty) {
        setShowSuccess(true);
        const timer = setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
    previousLoadingRef.current = isLoading;
  }, [isLoading, error, formData]);

  // Handle successful submission
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await handleSubmit(e);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit} className={styles.form}>
        <h1 className={styles.title}>Say hello</h1>
        
        {showSuccess && (
          <div className={styles.alert.success}>
            Message sent successfully!
          </div>
        )}
        
        {error && (
          <div className={styles.alert.error}>
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className={styles.label}>Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Who am I speaking to?"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            required
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="email" className={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            placeholder="Where can I write you back?"
            onChange={handleChange}
            className={styles.input}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="message" className={styles.label}>Message:</label>
          <textarea
            id="message"
            name="message"
            placeholder="Tell me everything"
            value={formData.message}
            onChange={handleChange}
            className={styles.textarea}
            rows={5}
            required
            disabled={isLoading}
          ></textarea>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={styles.button}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm">Sending...</span>
              </>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
