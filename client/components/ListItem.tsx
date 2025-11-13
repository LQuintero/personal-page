'use client';

import React from 'react';
import { Tooltip } from 'react-tooltip';

import LinkButton from './LinkButton';
import Button from './Button';
import { ListItemProps } from '@/types/ListItemProps';

const DEFAULT_TOOLTIP_POSITION = 'top';

const ListItem: React.FC<ListItemProps> = ({ 
  type, item, tooltipText, tooltipPosition
}) => {
  if (!item) return null;
  let toolTipContent = {};
  // Use item.id if available, otherwise generate a stable ID based on item properties
  const itemId = item.id || (type === 'link' && 'uri' in item 
    ? `link-${item.uri}` 
    : `button-${item.label || 'default'}`);
  const toolTipId = `tooltip-${itemId}`;
  const tooltipPlace = tooltipPosition || DEFAULT_TOOLTIP_POSITION; 
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
  
export default React.memo(ListItem);