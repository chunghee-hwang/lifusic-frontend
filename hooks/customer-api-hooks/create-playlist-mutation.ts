import { CREATE_PLAYLIST } from '@/apis/customer-apis';
import { MUSICS_IN_PLAYLIST, PLAYLISTS } from '@/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useCreatePlaylistMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: CREATE_PLAYLIST,
    onSuccess: () => {
      queryClient.invalidateQueries(PLAYLISTS);
      queryClient.invalidateQueries(MUSICS_IN_PLAYLIST());
    },
  });
  return mutation;
}

export default useCreatePlaylistMutation;
