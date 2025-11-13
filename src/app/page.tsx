'use client'

import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faSquareGithub, faSquareXTwitter } from '@fortawesome/free-brands-svg-icons';
// import { faSquareEnvelope, faFile } from '@fortawesome/free-solid-svg-icons';

import Home from './components/HomePage';
import { ListItemProps } from './types/ListItemProps';

const App = () => {
  const router = useRouter(); 

  const handleContactButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Navigate to /contact when the button is clicked
    router.push('/contact');
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
      type: 'link',
      item: {
        id: '3',
        icon: <FontAwesomeIcon id="github" icon={faSquareXTwitter} className={itemIconClassesShort} />,
        uri: "https://x.com/LauraQuintero",
        openInNewTab: true
      },
      tooltipText: 'Twitter',
      tooltipPosition: tooltipPosition
    },
    // {
    //   type: 'button',
    //   item: {
    //     id: '3',
    //     icon: <FontAwesomeIcon id="contact" icon={faSquareEnvelope} className={itemIconClassesShort} />,
    //     onClick: handleContactButtonClick
    //   },
    //   tooltipText: 'Contact Me',
    //   tooltipPosition: tooltipPosition
    // }
  ];


  return (
    <>
    <Script
            src="/particles/sketch.min.js"
            strategy="lazyOnload"
    />
    <Script
            src="/particles/particles.js"
            strategy="lazyOnload"
    />
    <div id="container">
      <Home
        title="Laura Quintero"
        subtitle="Technologist"
        list={listItems}
      />
    </div>
    </>
  );
};

export default App;
