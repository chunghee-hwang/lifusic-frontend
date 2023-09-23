import { ADD_MUSIC_TO_PLAYLIST } from '@/apis/customer-apis';
import { MUSICS_IN_PLAYLIST } from '@/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useAddMusicToPlaylistMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ADD_MUSIC_TO_PLAYLIST,
    onSuccess: () => {
      queryClient.invalidateQueries(MUSICS_IN_PLAYLIST());
    },
  });
  return mutation;
}

export default useAddMusicToPlaylistMutation;
