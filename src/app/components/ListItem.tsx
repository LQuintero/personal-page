'use client';

import React from 'react';
import LinkButton from './LinkButton';
import { Tooltip } from 'react-tooltip';

interface ListItemProps {
  id: string;
  text?: string;
  icon?: React.ReactNode;
  uri?: string;
  openUriInNewTab?: boolean;
  tooltipText?: string;
  tooltipPosition?: string;
}

const ListItem: React.FC<ListItemProps> = ({ 
  id, text, icon, uri, openUriInNewTab, tooltipText, tooltipPosition
}) => {
  const openLinkInNewTab = openUriInNewTab ? true : false;
  
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
        className={`flex items-center p-2 border-b`}
      >
        <div
          {...toolTipContent}
        >
          {uri ? (
            <LinkButton uri={uri} label={text} icon={icon} openInNewTab={openLinkInNewTab} />
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