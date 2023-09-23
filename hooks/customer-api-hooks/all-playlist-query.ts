import { GET_ALL_PLAYLIST } from '@/apis/customer-apis';
import { PLAYLISTS } from '@/constants/query-keys';
import { useQuery } from '@tanstack/react-query';

function useAllPlaylistQuery() {
  const result = useQuery({
    queryKey: PLAYLISTS,
    queryFn: GET_ALL_PLAYLIST,
    retry: false,
  });
  return result;
}

export default useAllPlaylistQuery;
