import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faSquareGithub } from '@fortawesome/free-brands-svg-icons';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { Tooltip } from 'react-tooltip';
import List from './components/List';

export default function Home() {
  const itemClassesShared = 'place-content-center'
  const itemClassesBrands = `h-9 ${itemClassesShared}`
  const itemClassesRegular = `h-8 ${itemClassesShared}`

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
          { id: '1',
            icon: <FontAwesomeIcon id="linkedin" icon={faLinkedin} className={itemClassesBrands}/>,
            tooltipText: 'LinkedIn'
          },
          { id: '2', icon: <FontAwesomeIcon id="github" icon={faSquareGithub} className={itemClassesBrands} /> },
          { id: '3', icon: <FontAwesomeIcon id="resume"icon={faFile} className={itemClassesRegular} /> }
        ]} 
        isHorizontal={true}
        />
      </div>
    </main>
  );
}
