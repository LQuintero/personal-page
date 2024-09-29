'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faSquareGithub } from '@fortawesome/free-brands-svg-icons';
import { faFile } from '@fortawesome/free-regular-svg-icons';

import Home from '../components/HomePage';
import { ListItemProps } from '../types/ListItemProps';

const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  const targetId = (event.target as HTMLButtonElement).id;
  console.log('Button clicked!', event, targetId);
};

const itemIconClassesShared = 'place-content-center';
const itemIconClassesBrands = `h-9 ${itemIconClassesShared}`;
const itemIconClassesRegular = `h-8 ${itemIconClassesShared}`;

const listItems: ListItemProps[] = [
  {
    type: 'link',
    item: {
      id: '1',
      icon: <FontAwesomeIcon id="linkedin" icon={faLinkedin} className={itemIconClassesBrands} />,
      uri: "https://www.linkedin.com/in/quinterolaura/",
      openInNewTab: true
    },
    tooltipText: 'LinkedIn'
  },
  {
    type: 'link',
    item: {
      id: '2',
      icon: <FontAwesomeIcon id="github" icon={faSquareGithub} className={itemIconClassesBrands} />,
      uri: "https://github.com/LQuintero",
      openInNewTab: true
    },
    tooltipText: 'GitHub'
  },
  {
    type: 'button',
    item: {
      id: '3',
      icon: <FontAwesomeIcon id="resume" icon={faFile} className={itemIconClassesRegular} />,
      onClick: handleButtonClick
    },
    tooltipText: 'Resume'
  }
];

const App = () => (
  <Home
    title="Laura Quintero"
    subtitle="Technologist"
    list={listItems}
  />
);

export default App;
