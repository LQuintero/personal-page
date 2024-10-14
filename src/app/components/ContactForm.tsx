import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  // State to hold form values
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
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
    // You can process form data here (e.g., send to API)
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');

    // Reset form after submission
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  // Common styles for input and textarea
  const inputClasses = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black";

  const labelClasses = "block text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 border rounded-lg shadow-lg min-w-[448px]">
      <div>
        <label htmlFor="firstname" className={labelClasses}>First Name</label>
        <input
          type="text"
          id="firstname"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label htmlFor="lastname" className={labelClasses}>Last Name</label>
        <input
          type="text"
          id="lastname"
          name="lastname"
          value={formData.lastname}
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
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
