'use client'

import React from 'react';
import { HomePageProps } from '../types/HomePageProps';  // Import the HomeProps type
import List from '../components/List';

const Home: React.FC<HomePageProps> = ({ title, subtitle, list }) => {
  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <div>
        <h1 className='text-7xl font-bold text-center tracking-wide mt-8'>
          {title}
        </h1>
        <p className='text-3xl text-center tracking-wide mt-8'>{subtitle}</p>
      </div>
      <div id="links" className='inline-block'>
        <List 
          items={list}
          isHorizontal={true}
        />
      </div>
    </main>
  );
};

export default Home;
