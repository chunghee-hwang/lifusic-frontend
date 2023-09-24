import { DELETE_MUSICS } from '@/apis/admin-apis';
import { MY_MUSIC } from '@/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useDeleteMusicMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: DELETE_MUSICS,
    onSuccess: () => {
      queryClient.invalidateQueries(MY_MUSIC());
    },
  });
  return mutation;
}

export default useDeleteMusicMutation;
