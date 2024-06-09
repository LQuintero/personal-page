'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faSquareGithub } from '@fortawesome/free-brands-svg-icons';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import List from './components/List';

//todo make into a client component
export default function Home() {
  const itemIconClassesShared = 'place-content-center'
  const itemIconClassesBrands = `h-9 ${itemIconClassesShared}`
  const itemIconClassesRegular = `h-8 ${itemIconClassesShared}`
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const targetId = (event.target as HTMLButtonElement).id;
    console.log('Button clicked!', event, targetId);
  };

  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <div>
        <h1 className='text-7xl font-bold text-center tracking-wide mt-8'>
          Laura Quintero
        </h1>
        <p className='text-3xl text-center tracking-wide mt-4'>Technologist</p>
      </div>
      <div id="links" className='inline-block'>
        <List items={[
          {
            id: '1',
            type: 'link',
            icon: <FontAwesomeIcon id="linkedin" icon={faLinkedin} className={itemIconClassesBrands}/>,
            uri: "https://www.linkedin.com/in/quinterolaura/",
            openUriInNewTab: true,
            tooltipText: 'LinkedIn'
          },
          {
            id: '2',
            type: 'link',
            icon: <FontAwesomeIcon id="github" icon={faSquareGithub} className={itemIconClassesBrands} />,
            uri: "https://github.com/LQuintero",
            openUriInNewTab: true,
            tooltipText: 'GitHub'
        },
          {
            id: '3',
            type: 'button',
            icon: <FontAwesomeIcon id="resume"icon={faFile} className={itemIconClassesRegular} />,
            tooltipText: 'Resume'
           }
        ]} 
        isHorizontal={true}
        />
      </div>
    </main>
  );
}
