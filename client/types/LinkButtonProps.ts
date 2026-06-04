import type { ReactNode } from 'react';

export interface LinkButtonProps {
  id?: string;
  icon?: ReactNode;
  uri: string;
  label?: string;
  openInNewTab?: boolean;
}
