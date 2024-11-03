'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faSquareGithub, faSquareXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faSquareEnvelope } from '@fortawesome/free-solid-svg-icons';

import Home from './components/HomePage';
import { ListItemProps } from './types/ListItemProps';
import Navbar from './components/Navbar';
import { useNavigateTo } from './navigationHook';

const App = () => {

  const navigateTo = useNavigateTo();

  const handleContactButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const targetId = (event.target as HTMLButtonElement).id;
    navigateTo('/contact');
  };

  const itemIconClassesShared = 'place-content-center';
  const itemIconClassesShort = `h-[36px] ${itemIconClassesShared}`;
  const itemIconClassesTall = `h-[32px] ${itemIconClassesShared}`;
  const tooltipPosition = 'bottom';
  
  const listItems: ListItemProps[] = [
    {
      type: 'link',
      item: {
        id: '1',
        icon: <FontAwesomeIcon id="linkedin" icon={faLinkedin} className={itemIconClassesShort} />,
        uri: "https://www.linkedin.com/in/quinterolaura/",
        openInNewTab: true
      },
      tooltipText: 'LinkedIn',
      tooltipPosition: tooltipPosition
    },
    {
      type: 'link',
      item: {
        id: '2',
        icon: <FontAwesomeIcon id="github" icon={faSquareGithub} className={itemIconClassesShort} />,
        uri: "https://github.com/LQuintero",
        openInNewTab: true
      },
      tooltipText: 'GitHub',
      tooltipPosition: tooltipPosition
    },
    {
      type: 'button',
      item: {
        id: '3',
        icon: <FontAwesomeIcon id="contact" icon={faSquareEnvelope} className={itemIconClassesShort} />,
        onClick: handleContactButtonClick
      },
      tooltipText: 'Contact Me',
      tooltipPosition: tooltipPosition
    }
  ];


  return (
    <>
    <Navbar />
    <Home
      title="Laura Quintero"
      subtitle="Technologist"
      list={listItems}
    />
    <div id="container">
      
    </div>
    </>
  );
};

export default App;
