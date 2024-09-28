import React from 'react';

export interface LinkButtonProps {
  id?: string;
  icon?: React.ReactNode;
  uri: string;
  label?: string;
  openInNewTab?: boolean;
}

const LinkButton: React.FC<LinkButtonProps> = ({ id, uri, label, icon, openInNewTab }) => {
    const target = openInNewTab ? '_blank' : '_self';
    const ariaLabelDefault = label ? label : `Link to ${uri}`;
    return (
        <a
            id={id}
            href={uri}
            target={target}
            className="flex items-center p-2 hover:scale-125"
            aria-label={ariaLabelDefault}
        >
         {icon && <span className="">{icon}</span>}
         {label && <span id='linkBtnLabel' className="ml-2">{label}</span>}
        </a>
    );
};

export default LinkButton;