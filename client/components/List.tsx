import ListItem from './ListItem';
import { ListItemProps } from '@/types/ListItemProps';

interface ListProps {
  items: ListItemProps[];
  isHorizontal?: boolean;
}

export default function List({ items, isHorizontal }: ListProps) {
  const listDirection = isHorizontal ? 'flex-row' : 'flex-col';

  return (
    <ul className={`list-none p-0 flex mt-4 ${listDirection}`}>
      {items.map((item) => (
        <ListItem
          key={item.item.id || item.item.uri}
          {...item}
        />
      ))}
    </ul>
  );
}
