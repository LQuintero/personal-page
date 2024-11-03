import { useRouter } from 'next/navigation';

export const useNavigateTo = () => {
  const router = useRouter();

  return (path: string) => {
    router.push(path);
  };
};
