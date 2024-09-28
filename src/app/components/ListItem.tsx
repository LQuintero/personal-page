'use client';

import React from 'react';
import LinkButton, { LinkButtonProps } from './LinkButton';
import IconButton, { IconButtonProps } from './IconButton';
import { Tooltip } from 'react-tooltip';

// interface ListItemProps {
//   id: string;
//   type: 'link' | 'button' | 'text';
//   text?: string;
//   icon?: React.ReactNode;
//   uri?: string;
//   openUriInNewTab?: boolean;
//   tooltipText?: string;
//   tooltipPosition?: string;
// }
interface ListItemProps extends LinkButtonProps, IconButtonProps {
  id: string;
  type: 'link' | 'button' | 'text';
  text?: string;
  tooltipText?: string;
  tooltipPosition?: string;
}

const ListItem: React.FC<ListItemProps> = ({ 
  id, type, text, icon, uri, openInNewTab, tooltipText, tooltipPosition
}) => {
  const openLinkInNewTab = openInNewTab ? true : false;
  
  let toolTipContent = {};
  const toolTipId = `${id}-tooltip`
  const tooltipPlace = tooltipPosition ? tooltipPosition : 'top'; 
  if (tooltipText) {
    toolTipContent = {
      "data-tooltip-id": toolTipId,
      "data-tooltip-content": tooltipText,
      "data-tooltip-place": tooltipPlace
    }
  }
  return (
      <li
        id={id}
        className={`flex items-center px-0.5 py-2`}
      >
        <div
          {...toolTipContent}
        >
          {type === 'link' && uri ? (
            <LinkButton uri={uri} label={text} icon={icon} openInNewTab={openLinkInNewTab} />
          ) : type === 'button' ? (
            <IconButton label={text} icon={icon} />
          ) : (
            <React.Fragment>
              {icon && <span>{icon}</span>}
              {text && <span className="ml-2">{text}</span>}
            </React.Fragment>
          )}
        </div>
        {tooltipText && <Tooltip id={toolTipId}/> }
      </li>
    );
  };
  
export default ListItem;