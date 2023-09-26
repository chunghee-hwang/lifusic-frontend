import { GET_ONE_MUSIC } from '@/apis/customer-apis';
import { ONE_MUSIC } from '@/constants/query-keys';
import { useQuery } from '@tanstack/react-query';

function useMusicQuery(musicId: number) {
  const result = useQuery({
    queryKey: ONE_MUSIC(musicId),
    queryFn: () => GET_ONE_MUSIC(musicId),
    retry: false,
  });
  return result;
}

export default useMusicQuery;
