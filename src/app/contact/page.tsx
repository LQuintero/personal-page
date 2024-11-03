'use client'

import React from 'react';
import ContactForm  from '../components/ContactForm';
import Navbar from '../components/Navbar';
const Contact = () => (
  <>
  <Navbar />
  <div className="flex justify-center items-center h-screen">
    <ContactForm />
  </div>
  </>
);

export default Contact;