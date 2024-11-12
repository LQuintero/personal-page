import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { config } from '../../../config';
import styles from '../styles/ContactForm.module.css';

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState('');
  // State to hold form values
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setStatus('Sending...');
    emailjs
      .send(
        config.email.emailSvcId as string,
        config.email.emailTemplateId as string, formData,
        config.email.emailUserId as string)
      .then(
        (response) => {
          console.log('Email sent successfully!', response.status, response.text);
          setStatus('Message sent successfully!');
          // Reset form after submission
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            subject: '',
            message: ''
          });
        },
        (error) => {
          console.error('Failed to send email:', error);
          setStatus('Failed to send message. Please try again later.');
        }
      );
  };

  // Common styles for input and textarea
  const inputClasses = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black";
  const labelClasses = "block text-sm font-medium";

  return (
    <form onSubmit={handleSubmit} className={styles.contactForm}>
      <div>
        <label htmlFor="firstName" className={labelClasses}>First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label htmlFor="lastName" className={labelClasses}>Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={inputClasses}
          required
        />
      </div>
      
      <div>
        <label htmlFor="email" className={labelClasses}>Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label htmlFor="subject" className={labelClasses}>Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={inputClasses}
          rows={4}
          required
        ></textarea>
      </div>

      <div>
        <button
          type="submit"
          className="primary-button"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
