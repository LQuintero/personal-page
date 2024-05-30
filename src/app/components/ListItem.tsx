'use client';

import React from 'react';
import IconButton from './IconButton';
import { Tooltip } from 'react-tooltip';


interface ListItemProps {
  id?: string;
  text?: string;
  callback?: () => void;
  icon?: React.ReactNode;
}

const ListItem: React.FC<ListItemProps> = ({ id, text, callback, icon }) => {
    return (
      <li
        id={id}
        className={`flex items-center p-2 border-b`}
      >
        <div
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Hello world!"
        >
        {icon ? (
            IconButton({ icon, onClick: callback, label: text })
        ) : (
            <span onClick={callback}>{text}</span>
        )}
        </div>
        <Tooltip id="my-tooltip"/>
      </li>
    );
  };
  
export default ListItem;