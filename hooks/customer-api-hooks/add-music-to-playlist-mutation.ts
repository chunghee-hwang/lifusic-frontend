import { ADD_MUSIC_TO_PLAYLIST, CREATE_PLAYLIST } from '@/apis/customer-apis';
import { MUSICS_IN_PLAYLIST, PLAYLISTS } from '@/constants/query-keys';
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
