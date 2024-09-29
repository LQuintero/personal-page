import React from 'react';

export interface ButtonProps {
  id?: string;
  icon?: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
}

const Button: React.FC<ButtonProps> = ({ id, icon, onClick, label }) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className="flex items-center p-2 hover:scale-125"
      aria-label={label}
    >
     {icon && <span className="">{icon}</span>}
     {label && <span className="ml-2">{label}</span>}
    </button>
  );
};

export default Button;