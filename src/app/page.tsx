import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faSquareGithub } from '@fortawesome/free-brands-svg-icons';
import { Tooltip } from 'react-tooltip';

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1 className="text-4xl font-bold text-center">
          Laura Quintero
        </h1>
        <p>Technologist</p>
      </div>
      <div id="links">
        <ul>
          <li data-tooltip-id="linkedinTooltip" data-tooltip-content="LinkedIn">
            <FontAwesomeIcon id="linkedin" icon={faLinkedin} />
            </li>
          <li>
            <FontAwesomeIcon id="github" icon={faSquareGithub} />
          </li>
          <li>
            <FontAwesomeIcon icon={faSquareGithub} />
            </li>
        </ul>
      </div>
    </main>
  );
}
