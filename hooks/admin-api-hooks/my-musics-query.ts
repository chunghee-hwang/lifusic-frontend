import { GET_MY_MUSICS } from '@/apis/admin-apis';
import { MY_MUSIC } from '@/constants/query-keys';
import { useQuery } from '@tanstack/react-query';

function useMyMusicsQuery(request: SearchArtistMusicRequest) {
  const result = useQuery({
    queryKey: MY_MUSIC(request),
    queryFn: GET_MY_MUSICS,
  });
  return result;
}

export default useMyMusicsQuery;
