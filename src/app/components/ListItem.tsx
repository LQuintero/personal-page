'use client';

import React from 'react';
import IconButton from './IconButton';
import { Tooltip } from 'react-tooltip';

interface ListItemProps {
  id: string;
  text?: string;
  icon?: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  tooltipText?: string;
  tooltipPosition?: string;
}

const ListItem: React.FC<ListItemProps> = ({ 
  id, text, icon, onClick, tooltipText, tooltipPosition
}) => {
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
        {icon ? (
            IconButton({ icon, onClick: onClick, label: text })
        ) : (
            <span onClick={onClick}>{text}</span>
        )}
        </div>
        {tooltipText && <Tooltip id={toolTipId}/> }
      </li>
    );
  };
  
export default ListItem;