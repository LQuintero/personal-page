'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faSquareGithub } from '@fortawesome/free-brands-svg-icons';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import List from './components/List';

//todo make into a client component
export default function Home() {
  const itemClassesShared = 'place-content-center'
  const itemClassesBrands = `h-9 ${itemClassesShared}`
  const itemClassesRegular = `h-8 ${itemClassesShared}`
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const targetId = (event.target as HTMLButtonElement).id;
    console.log('Button clicked!', event, targetId);
  };
  // const btnCallback = () => {
  //   window.open('https://www.linkedin.com/in/quintero.laura/')
  // }
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
            icon: <FontAwesomeIcon id="linkedin" icon={faLinkedin} className={itemClassesBrands}/>,
            onClick: handleButtonClick,
            tooltipText: 'LinkedIn'
          },
          {
            id: '2',
          icon: <FontAwesomeIcon id="github" icon={faSquareGithub} className={itemClassesBrands} />,
          onClick: handleButtonClick,
          tooltipText: 'GitHub'
        },
          {
            id: '3',
            icon: <FontAwesomeIcon id="resume"icon={faFile} className={itemClassesRegular} />,
            onClick: handleButtonClick,
            tooltipText: 'Resume'
           }
        ]} 
        isHorizontal={true}
        />
      </div>
    </main>
  );
}
