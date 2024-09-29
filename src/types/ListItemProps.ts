import { ButtonProps, LinkButtonProps } from './ButtonProps';

export interface ListItemLinkProps {
  type: 'link';
  item: LinkButtonProps;
  tooltipText?: string;
  tooltipPosition?: string;
}

export interface ListItemButtonProps {
  type: 'button'; 
  item: ButtonProps;
  tooltipText?: string;
  tooltipPosition?: string;
}

export type ListItemProps = ListItemLinkProps | ListItemButtonProps;
