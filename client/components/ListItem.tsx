import LinkButton from './LinkButton';
import { ListItemProps } from '@/types/ListItemProps';

const DEFAULT_TOOLTIP_POSITION = 'top';
const tooltipPositionClasses: Record<string, string> = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
};

export default function ListItem({ item, tooltipText, tooltipPosition }: ListItemProps) {
  const itemId = item.id || `link-${item.uri}`;
  const tooltipPlace = tooltipPosition || DEFAULT_TOOLTIP_POSITION;
  const tooltipClassName = tooltipPositionClasses[tooltipPlace] || tooltipPositionClasses[DEFAULT_TOOLTIP_POSITION];

  return (
    <li
      id={itemId}
      className="flex items-center px-0.5 py-2"
    >
      <div className="group relative">
        <LinkButton
          uri={item.uri}
          label={item.label}
          icon={item.icon}
          openInNewTab={item.openInNewTab}
        />
        {tooltipText && (
          <span
            className={`pointer-events-none absolute z-10 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 ${tooltipClassName}`}
            role="tooltip"
          >
            {tooltipText}
          </span>
        )}
      </div>
    </li>
  );
}