import { ADD_MUSIC } from '@/apis/admin-apis';
import { MY_MUSIC } from '@/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useAddMusicMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ADD_MUSIC,
    onSuccess: () => {
      queryClient.invalidateQueries(MY_MUSIC());
    },
  });
  return mutation;
}

export default useAddMusicMutation;
