'use client'

import React from 'react';
import { HomePageProps } from '../types/HomePageProps';
import List from './List';
import styles from '../styles/HomePage.module.css';

const Home: React.FC<HomePageProps> = ({ title, subtitle, list }) => {
  return (
    <main
    className={`${styles.main} flex flex-col items-center p-24`}
    >
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

export default React.memo(Home);
