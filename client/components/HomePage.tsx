import { HomePageProps } from '@/client/types/HomePageProps';
import List from './List';
import ChatBar from './ChatBar';
import styles from '@/client/styles/HomePage.module.css';

export default function Home({ title, subtitle, list }: HomePageProps) {
  return (
    <main className={`${styles.main} px-6`}>
      <div className={styles.content}>
        <div className={styles.hero}>
          <h1 className="text-5xl sm:text-6xl font-bold text-center tracking-wide">
            {title}
          </h1>
          <p className="text-xl sm:text-2xl text-center tracking-wide mt-[1rem] sm:mt-[1.575rem]">
            {subtitle}
          </p>

          <div id="links" className="inline-block mt-[0.95rem] sm:mt-[1.496rem]">
            <List items={list} isHorizontal={true} />
          </div>
        </div>

        <div className={styles.chatSlot}>
          <ChatBar />
        </div>
      </div>
    </main>
  );
}
