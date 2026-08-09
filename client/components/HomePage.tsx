import { HomePageProps } from '@/types/HomePageProps';
import List from './List';
import ChatBar from './ChatBar';
import styles from '@/styles/HomePage.module.css';

export default function Home({ title, subtitle, list }: HomePageProps) {
  return (
    <main
      className={`${styles.main} px-6`}
    >
      <div>
        <h1 className='text-7xl font-bold text-center tracking-wide mt-8'>
          {title}
        </h1>
        <p className='text-3xl text-center tracking-wide mt-8'>{subtitle}</p>
      </div>

      <div className='w-full max-w-md mx-auto mt-10'>
        <ChatBar />
      </div>

      <div id="links" className='inline-block mt-10'>
        <List
          items={list}
          isHorizontal={true}
        />
      </div>
    </main>
  );
}
