import { LOGIN } from '@/apis/account-apis';
import { AUTH_KEY } from '@/constants/cookie-keys';
import { USER_KEY } from '@/constants/query-keys';
import { LoginSuccessResponse } from '@/constants/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

function useLoginMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: LOGIN,
    onSuccess: (data: LoginSuccessResponse) => {
      if (data.token) {
        Cookies.set(AUTH_KEY, data.token, {
          expires: 1,
        });
        queryClient.invalidateQueries(USER_KEY);
      }
    },
    retry: false,
  });
  return mutation;
}

export default useLoginMutation;
