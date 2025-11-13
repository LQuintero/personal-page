'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useContactForm } from '../hooks/useContactForm';

const ContactForm: React.FC = () => {
  const { formData, isLoading, error, handleChange, handleSubmit } = useContactForm();
  const [showSuccess, setShowSuccess] = useState(false);
  const previousLoadingRef = useRef(false);

  // Watch for successful submission (when loading goes from true to false without error)
  useEffect(() => {
    if (previousLoadingRef.current && !isLoading && !error) {
      // Form was just submitted successfully
      const isFormEmpty = !formData.name && !formData.email && !formData.subject && !formData.message;
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
    <div className="max-w-md mx-auto p-6">
      <form onSubmit={onSubmit} className="space-y-4 border rounded-lg shadow-lg p-6">
        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Message sent successfully!
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            required
            disabled={isLoading}
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
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
