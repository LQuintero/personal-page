import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faSquareGithub, faSquareXTwitter } from '@fortawesome/free-brands-svg-icons';

import Home from '@/components/HomePage';
import ParticleScripts from '@/components/ParticleScripts';
import siteConfig from '@/site.config';
import { ListItemProps } from '@/types/ListItemProps';
import { ITEM_ICON_CLASSES_SHORT, TOOLTIP_POSITION } from '@/constants/iconClasses';

const listItems: ListItemProps[] = [
  {
    item: {
      id: 'linkedin',
      icon: <FontAwesomeIcon id="linkedin" icon={faLinkedin} className={ITEM_ICON_CLASSES_SHORT} />,
      uri: siteConfig.social.linkedin,
      openInNewTab: true
    },
    tooltipText: 'LinkedIn',
    tooltipPosition: TOOLTIP_POSITION
  },
  {
    item: {
      id: 'github',
      icon: <FontAwesomeIcon id="github" icon={faSquareGithub} className={ITEM_ICON_CLASSES_SHORT} />,
      uri: siteConfig.social.github,
      openInNewTab: true
    },
    tooltipText: 'GitHub',
    tooltipPosition: TOOLTIP_POSITION
  },
  {
    item: {
      id: 'twitter',
      icon: <FontAwesomeIcon id="twitter" icon={faSquareXTwitter} className={ITEM_ICON_CLASSES_SHORT} />,
      uri: siteConfig.social.twitter,
      openInNewTab: true
    },
    tooltipText: 'Twitter',
    tooltipPosition: TOOLTIP_POSITION
  },
];

export default function App() {
  return (
    <>
      <ParticleScripts />
      <div id="container">
        <Home
          title={siteConfig.name}
          subtitle={siteConfig.tagline}
          list={listItems}
        />
      </div>
    </>
  );
}
