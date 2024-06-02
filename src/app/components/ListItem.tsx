'use client';

import React from 'react';
import IconButton from './IconButton';
import { Tooltip } from 'react-tooltip';
import { v4 as uuidv4 } from 'uuid';

interface ListItemProps {
  id: string;
  text?: string;
  callback?: () => void;
  icon?: React.ReactNode;
  tooltipText?: string;
  tooltipPosition?: string;
}

const ListItem: React.FC<ListItemProps> = ({ id, text, callback,
  icon, tooltipText, tooltipPosition }) => {
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
            IconButton({ icon, onClick: callback, label: text })
        ) : (
            <span onClick={callback}>{text}</span>
        )}
        </div>
        {tooltipText && <Tooltip id={toolTipId}/> }
      </li>
    );
  };
  
export default ListItem;