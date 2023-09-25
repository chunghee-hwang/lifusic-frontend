import { SEARCH_MUSIC } from '@/apis/customer-apis';
import { SEARCHED_MUSIC } from '@/constants/query-keys';
import { SearchMusicRequest } from '@/constants/types/types';
import { useQuery } from '@tanstack/react-query';

function useSearchMusicQuery(request: SearchMusicRequest) {
  const result = useQuery({
    queryKey: SEARCHED_MUSIC(request),
    queryFn: () => SEARCH_MUSIC(request),
    retry: false,
  });
  return result;
}

export default useSearchMusicQuery;
