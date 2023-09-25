import { GET_MUSICS_IN_PLAYLIST } from '@/apis/customer-apis';
import { MUSICS_IN_PLAYLIST } from '@/constants/query-keys';
import { GetMusicsInPlaylistRequest } from '@/constants/types/types';
import { useQuery } from '@tanstack/react-query';

function useMusicsInPlaylistQuery(request: GetMusicsInPlaylistRequest) {
  const result = useQuery({
    queryKey: MUSICS_IN_PLAYLIST(request),
    queryFn: () => GET_MUSICS_IN_PLAYLIST(request),
    retry: false,
  });
  return result;
}

export default useMusicsInPlaylistQuery;
