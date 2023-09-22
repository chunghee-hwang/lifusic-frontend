import { SIGNUP } from '@/apis/account-apis';
import { useMutation } from '@tanstack/react-query';

function useSignUpMutation() {
  const mutation = useMutation({
    mutationFn: SIGNUP,
    retry: false,
  });
  return mutation;
}

export default useSignUpMutation;
