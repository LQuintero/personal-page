'use client';

import React from 'react';
import { Tooltip } from 'react-tooltip';

import LinkButton from './LinkButton';
import Button from './Button';
import { ListItemProps } from '../types';

const ListItem: React.FC<ListItemProps> = ({ 
  type, item, tooltipText, tooltipPosition
}) => {
  if (!item) return null;
  let toolTipContent = {};
  const itemId = item.id ? item.id : Math.random().toString();
  const toolTipId = `tooltip-${itemId}`;
  const tooltipPlace = tooltipPosition || 'top'; 
  if (tooltipText) {
    toolTipContent = {
      "data-tooltip-id": toolTipId,
      "data-tooltip-content": tooltipText,
      "data-tooltip-place": tooltipPlace
    }
  }
  return (
      <li
        id={itemId}
        className={`flex items-center px-0.5 py-2`}
      >
        <div
          {...toolTipContent}
        >
          {type === 'link' && 'uri' in item ? (
            <LinkButton uri={item.uri} label={item.label} icon={item.icon} openInNewTab={item.openInNewTab} />
          ) : type === 'button' && 'onClick' in item ? (
            <Button label={item.label} icon={item.icon} onClick={item.onClick}/>
          ) : null}
        </div>
        {tooltipText && <Tooltip id={toolTipId}/> }
      </li>
    );
  };
  
export default ListItem;