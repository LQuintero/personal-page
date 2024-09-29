'use client';

import React from 'react';
import ListItem from './ListItem';
import { ListItemProps, ListItemLinkProps, ListItemButtonProps } from '../types/ListItemProps';

interface ListProps {
  items: ListItemProps[];
  isHorizontal?: boolean;
}

const List: React.FC<ListProps> = ({ items, isHorizontal }) => {
  const listDirection = isHorizontal ? 'flex-row' : 'flex-col';
  return (
    <ul className={`list-none p-0 flex mt-4 ${listDirection}`}>
      {items.map((item, index) => (
        <ListItem
          key={index}
          {...(item.type === 'link'
            ? { ...item as ListItemLinkProps }
            : { ...item as ListItemButtonProps })}
        />
      ))}
    </ul>
  );
};

export default List;
