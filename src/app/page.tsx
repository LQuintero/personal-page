'use client'

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faSquareGithub } from '@fortawesome/free-brands-svg-icons';
import { faSquareEnvelope } from '@fortawesome/free-solid-svg-icons';

import Home from '../components/HomePage';
import { ListItemProps } from '../types/ListItemProps';

const App = () => {
  const router = useRouter(); 

  const handleContactButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const targetId = (event.target as HTMLButtonElement).id;
    console.log('Button clicked!', event, targetId);
    
    // Navigate to /contact when the button is clicked
    router.push('/contact');
  };

  const itemIconClassesShared = 'h-[36px] place-content-center';
  const itemIconClassesBrands = `h-9 ${itemIconClassesShared}`;
  const itemIconClassesRegular = `h-9 ${itemIconClassesShared}`;

  const listItems: ListItemProps[] = [
    {
      type: 'link',
      item: {
        id: '1',
        icon: <FontAwesomeIcon id="linkedin" icon={faLinkedin} className={itemIconClassesBrands} />,
        uri: "https://www.linkedin.com/in/quinterolaura/",
        openInNewTab: true
      },
      tooltipText: 'LinkedIn',
      tooltipPosition: 'bottom'
    },
    {
      type: 'link',
      item: {
        id: '2',
        icon: <FontAwesomeIcon id="github" icon={faSquareGithub} className={itemIconClassesBrands} />,
        uri: "https://github.com/LQuintero",
        openInNewTab: true
      },
      tooltipText: 'GitHub',
      tooltipPosition: 'bottom'
    },
    {
      type: 'button',
      item: {
        id: '3',
        icon: <FontAwesomeIcon id="contact" icon={faSquareEnvelope} className={itemIconClassesRegular} />,
        onClick: handleContactButtonClick
      },
      tooltipText: 'Contact Me',
      tooltipPosition: 'bottom'
    }
  ];


  return (
    <Home
      title="Laura Quintero"
      subtitle="Technologist"
      list={listItems}
    />
  );
};

export default App;
