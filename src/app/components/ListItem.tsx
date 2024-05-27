import React from 'react';
import IconButton from './IconButton';

interface ListItemProps {
  text?: string;
  callback?: () => void;
  icon?: React.ReactNode;
}

const ListItem: React.FC<ListItemProps> = ({ text, callback, icon }) => {
    return (
      <li className={`flex items-center p-2 border-b'}`}>
        {icon ? (
            IconButton({ icon, onClick: callback, label: text })
        ) : (
            <span onClick={callback}>{text}</span>
        )}
      </li>
    );
  };
  
export default ListItem;