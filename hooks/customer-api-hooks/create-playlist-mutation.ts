import { CREATE_PLAYLIST } from '@/apis/customer-apis';
import { PLAYLISTS } from '@/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useCreatePlaylistMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: CREATE_PLAYLIST,
    onSuccess: () => {
      queryClient.invalidateQueries(PLAYLISTS);
    },
  });
  return mutation;
}

export default useCreatePlaylistMutation;
