'use client'

import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faSquareGithub, faSquareXTwitter } from '@fortawesome/free-brands-svg-icons';
// import { faSquareEnvelope, faFile } from '@fortawesome/free-solid-svg-icons';

import Home from './components/HomePage';
import ErrorBoundary from './components/ErrorBoundary';
import { ListItemProps } from './types/ListItemProps';
import { ITEM_ICON_CLASSES_SHORT, TOOLTIP_POSITION } from './constants/iconClasses';

const App = () => {
  const router = useRouter(); 

  const handleContactButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Navigate to /contact when the button is clicked
    router.push('/contact');
  };
  
  const listItems: ListItemProps[] = [
    {
      type: 'link',
      item: {
        id: '1',
        icon: <FontAwesomeIcon id="linkedin" icon={faLinkedin} className={ITEM_ICON_CLASSES_SHORT} />,
        uri: "https://www.linkedin.com/in/quinterolaura/",
        openInNewTab: true
      },
      tooltipText: 'LinkedIn',
      tooltipPosition: TOOLTIP_POSITION
    },
    {
      type: 'link',
      item: {
        id: '2',
        icon: <FontAwesomeIcon id="github" icon={faSquareGithub} className={ITEM_ICON_CLASSES_SHORT} />,
        uri: "https://github.com/LQuintero",
        openInNewTab: true
      },
      tooltipText: 'GitHub',
      tooltipPosition: TOOLTIP_POSITION
    },
    {
      type: 'link',
      item: {
        id: '3',
        icon: <FontAwesomeIcon id="github" icon={faSquareXTwitter} className={ITEM_ICON_CLASSES_SHORT} />,
        uri: "https://x.com/LauraQuintero",
        openInNewTab: true
      },
      tooltipText: 'Twitter',
      tooltipPosition: TOOLTIP_POSITION
    },
    // {
    //   type: 'button',
    //   item: {
    //     id: '3',
    //     icon: <FontAwesomeIcon id="contact" icon={faSquareEnvelope} className={ITEM_ICON_CLASSES_SHORT} />,
    //     onClick: handleContactButtonClick
    //   },
    //   tooltipText: 'Contact Me',
    //   tooltipPosition: TOOLTIP_POSITION
    // }
  ];


  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default App;
