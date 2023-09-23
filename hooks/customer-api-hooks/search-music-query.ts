import { SEARCH_MUSIC } from '@/apis/customer-apis';
import { SEARCHED_MUSIC } from '@/constants/query-keys';
import { useQuery } from '@tanstack/react-query';

function useSearchMusicQuery(request: SearchMusicRequest) {
  const result = useQuery({
    queryKey: SEARCHED_MUSIC(request),
    queryFn: SEARCH_MUSIC,
    retry: false,
  });
  return result;
}

export default useSearchMusicQuery;
