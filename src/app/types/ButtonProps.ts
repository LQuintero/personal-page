export interface ButtonProps {
  id?: string;
  icon?: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
}

export interface LinkButtonProps {
  id?: string;
  icon?: React.ReactNode;
  uri: string;
  label?: string;
  openInNewTab?: boolean;
}
