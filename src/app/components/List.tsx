'use client';

import React from 'react';
import ListItem, { ListItemProps } from './ListItem';

interface ListProps {
  items: ListItemProps[];
  isHorizontal?: boolean;
}

const List: React.FC<ListProps> = ({ items, isHorizontal }) => {
  const listDirection = isHorizontal ? 'flex-row' : 'flex-col';
  return (
    <ul className={`list-none p-0 flex ${listDirection}`}>
      {items.map((item, index) => (
        <ListItem
          key={index}
          type={item.type}
          item={item.item}
          tooltipText={item.tooltipText}
          tooltipPosition={item.tooltipPosition}
        />
      ))}
    </ul>
  );
};

export default List;
