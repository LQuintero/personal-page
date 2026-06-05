import { LinkButtonProps } from '@/types/LinkButtonProps';

export default function LinkButton({ id, uri, label, icon, openInNewTab }: LinkButtonProps) {
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
      {icon && <span aria-hidden="true">{icon}</span>}
      {label && <span className="ml-2">{label}</span>}
    </a>
  );
}