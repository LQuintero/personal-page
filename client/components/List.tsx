import ListItem from './ListItem';
import { ListItemProps } from '@/client/types/ListItemProps';

interface ListProps {
  items: ListItemProps[];
  isHorizontal?: boolean;
}

export default function List({ items, isHorizontal }: ListProps) {
  const listDirection = isHorizontal ? 'flex-row' : 'flex-col';

  return (
    <ul className={`list-none p-0 flex ${listDirection}`}>
      {items.map((item) => (
        <ListItem
          key={item.item.id || item.item.uri}
          {...item}
        />
      ))}
    </ul>
  );
}
