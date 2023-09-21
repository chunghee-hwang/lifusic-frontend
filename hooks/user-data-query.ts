import { GET_USER_DATA } from '@/apis/account-apis';
import { USER_KEY } from '@/constants/query-keys';
import { useQuery } from '@tanstack/react-query';

function useUserDataQuery() {
  const result = useQuery({
    queryKey: USER_KEY,
    queryFn: GET_USER_DATA,
  });
  return result;
}

export default useUserDataQuery;
