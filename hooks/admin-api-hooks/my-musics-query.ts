import { GET_MY_MUSICS } from '@/apis/admin-apis';
import { MY_MUSIC } from '@/constants/query-keys';
import { SearchArtistMusicRequest } from '@/constants/types/types';
import { useQuery } from '@tanstack/react-query';

function useMyMusicsQuery(request: SearchArtistMusicRequest) {
  const result = useQuery({
    queryKey: MY_MUSIC(request),
    queryFn: () => GET_MY_MUSICS(request),
  });
  return result;
}

export default useMyMusicsQuery;
