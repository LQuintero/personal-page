import React from 'react';
import { LinkButtonProps } from '@/types/ButtonProps';

const LinkButton: React.FC<LinkButtonProps> = ({ id, uri, label, icon, openInNewTab }) => {
    const target = openInNewTab ? '_blank' : '_self';
    const ariaLabelDefault = label ? label : `Link to ${uri}`;
    return (
        <a
            id={id}
            href={uri}
            target={target}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
            className="flex items-center p-2 hover:scale-125 transition-transform"
            aria-label={ariaLabelDefault}
        >
         {icon && <span className="" aria-hidden="true">{icon}</span>}
         {label && <span id='linkBtnLabel' className="ml-2">{label}</span>}
        </a>
    );
};

export default React.memo(LinkButton);