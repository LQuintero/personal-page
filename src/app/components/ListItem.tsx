'use client';

import React from 'react';
import IconButton from './IconButton';
import { Tooltip } from 'react-tooltip';


interface ListItemProps {
  id?: string;
  text?: string;
  callback?: () => void;
  icon?: React.ReactNode;
  tooltipText?: string;
  tooltipPosition?: string;
}

const ListItem: React.FC<ListItemProps> = ({ id, text, callback,
  icon, tooltipText, tooltipPosition }) => {
  const toolTipContent = tooltipText ?  tooltipText : '';
  const tooltipPlace = tooltipPosition ? tooltipPosition : 'top'; 
  return (
      <li
        id={id}
        className={`flex items-center p-2 border-b`}
      >
        <div
          data-tooltip-id={`${id}-tooltip`}
          data-tooltip-content={toolTipContent}
        >
        {icon ? (
            IconButton({ icon, onClick: callback, label: text })
        ) : (
            <span onClick={callback}>{text}</span>
        )}
        </div>
        {tooltipText && <Tooltip id={`${id}-tooltip`}/> }
      </li>
    );
  };
  
export default ListItem;