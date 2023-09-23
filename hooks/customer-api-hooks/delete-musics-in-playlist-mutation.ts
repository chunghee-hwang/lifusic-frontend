import { DELETE_MUSICS_IN_PLAYLIST } from '@/apis/customer-apis';
import { MUSICS_IN_PLAYLIST } from '@/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useDeleteMusicsInPlaylistMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: DELETE_MUSICS_IN_PLAYLIST,
    onSuccess: () => {
      queryClient.invalidateQueries(MUSICS_IN_PLAYLIST());
    },
  });
  return mutation;
}

export default useDeleteMusicsInPlaylistMutation;
