'use client';

import React from 'react';
import ListItem from './ListItem';
import { ListItemProps, ListItemLinkProps, ListItemButtonProps } from '@/types/ListItemProps';

interface ListProps {
  items: ListItemProps[];
  isHorizontal?: boolean;
}

const List: React.FC<ListProps> = ({ items, isHorizontal }) => {
  const listDirection = isHorizontal ? 'flex-row' : 'flex-col';
  return (
    <ul className={`list-none p-0 flex mt-4 ${listDirection}`}>
      {items.map((item) => (
        <ListItem
          key={item.item?.id || `list-item-${item.type}-${item.type === 'link' ? item.item?.uri || 'link' : 'button'}`}
          {...(item.type === 'link'
            ? { ...item as ListItemLinkProps }
            : { ...item as ListItemButtonProps })}
        />
      ))}
    </ul>
  );
};

export default React.memo(List);
