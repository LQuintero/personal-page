'use client'

import React from 'react';
import ContactForm  from '@/components/ContactForm';
import NavBar from '@/components/NavBar';

const Contact = () => (
  <div className="flex flex-col">
    <NavBar />
    <div className="flex justify-center pt-16 pb-8">
      <ContactForm />
    </div>
  </div>
);

export default Contact;