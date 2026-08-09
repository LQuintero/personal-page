import { HomePageProps } from '@/client/types/HomePageProps';
import List from './List';
import ChatBar from './ChatBar';
import styles from '@/client/styles/HomePage.module.css';

export default function Home({ title, subtitle, list }: HomePageProps) {
  return (
    <main className={`${styles.main} px-6`}>
      <div className={styles.content}>
        <div className={styles.identity}>
          <h1 className="text-[clamp(1.75rem,7.5vw,3.75rem)] sm:text-6xl font-bold text-center tracking-normal sm:tracking-wide max-w-full text-balance">
            {title}
          </h1>
          <p className="text-xl sm:text-2xl text-center tracking-wide mt-1.5 sm:mt-2">
            {subtitle}
          </p>

          <div id="links" className="inline-block mt-2 sm:mt-2.5">
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
