// src/components/List.tsx
import React, { useState } from 'react';
import ListItem from './ListItem';

interface Item {
  id: string;
  text?: string;
  icon?: React.ReactNode;
  callback?: () => void;
  tooltipText?: string;
}

interface ListProps {
  items: Item[];
  isHorizontal?: boolean;
}

const List: React.FC<ListProps> = ({ items, isHorizontal }) => {
  const listDirection = isHorizontal ? 'flex-row' : 'flex-col';
  return (
    <ul className={`list-none p-0 flex ${listDirection}`}>
      {items.map((item) => (
        <ListItem
          key={item.id}
          id={item.id}
          text={item.text}
          icon={item.icon}
          callback={item.callback}
          tooltipText={item.tooltipText}
          tooltipPosition='bottom'
        />
      ))}
    </ul>
  );
};

export default List;
