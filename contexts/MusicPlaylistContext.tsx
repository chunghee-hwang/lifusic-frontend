import { GET_ALL_PLAYLIST } from '@/apis/customer-apis';
import {
  MusicPlaylistContextValue,
  OrderDirection,
  Playlist,
} from '@/constants/types/types';
import useCreatePlaylistMutation from '@/hooks/customer-api-hooks/create-playlist-mutation';
import useMusicsInPlaylistQuery from '@/hooks/customer-api-hooks/musics-inplaylist-query';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/**
 * 플레이리스트에 있는 음악 정보를 담은 컨텍스트
 */
const MusicPlaylistContext = createContext<MusicPlaylistContextValue>({
  defaultPlaylist: null,
  musicsInPlaylist: [], // 플레이리스트에 들어있는 음악 정보
  isFetchingMusics: false, // 음악을 불러오는 중인지
  isFetchMusicError: false, // 음악 불러오다가 에러 발생 여부
  playlistMusicOrderBy: 'name', // 플레이리스트에 있는 음악 정렬 필드
  setPlaylistMusicOrderBy: (order: string) => {},
  playlistMusicOrderDirection: 'asc', // 플레이리스트에 있는 음악 오름차순 내림차순
  setPlaylistMusicOrderDirection: (direction: OrderDirection) => {},
});

MusicPlaylistContext.displayName = 'MusicPlaylistContext';

export const useMusicPlaylist = () => {
  return useContext(MusicPlaylistContext);
};

export const MusicPlaylistContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [defaultPlaylist, setDefaultPlaylist] = useState<Playlist | null>(null);

  const {
    mutateAsync: createPlaylistMutation,
    isLoading: isCreatingPlaylist,
    isError: isCreatePlaylistError,
  } = useCreatePlaylistMutation();

  const creatingPlaylist = useRef<boolean>(false);

  useEffect(() => {
    async function getDefaultPlaylist() {
      if (defaultPlaylist) {
        return;
      }
      const playlists = await GET_ALL_PLAYLIST();
      if (playlists?.[0]) {
        setDefaultPlaylist(playlists?.[0]);
      } else {
        if (!creatingPlaylist.current) {
          creatingPlaylist.current = true;
          const createdPlaylist = await createPlaylistMutation({
            name: 'Default Playlist',
          });
          setDefaultPlaylist({
            id: createdPlaylist.playlistId,
            name: createdPlaylist.name,
          });
        }
      }
    }
    getDefaultPlaylist();
  }, []);

  const [playlistMusicOrderBy, setPlaylistMusicOrderBy] =
    useState<string>('name');
  const [playlistMusicOrderDirection, setPlaylistMusicOrderDirection] =
    useState<OrderDirection>('asc');

  const {
    data: musicsInPlaylist,
    isLoading: isFetchingMusics,
    isError: isFetchMusicError,
  } = useMusicsInPlaylistQuery({
    playlistId: defaultPlaylist?.id,
    orderBy: playlistMusicOrderBy,
    orderDirection: playlistMusicOrderDirection,
  });

  const value = useMemo(
    () => ({
      defaultPlaylist,
      musicsInPlaylist: musicsInPlaylist ?? [],
      isFetchingMusics: isFetchingMusics || isCreatingPlaylist,
      isFetchMusicError: isFetchMusicError || isCreatePlaylistError,
      playlistMusicOrderBy,
      setPlaylistMusicOrderBy,
      playlistMusicOrderDirection,
      setPlaylistMusicOrderDirection,
    }),
    [
      playlistMusicOrderBy,
      setPlaylistMusicOrderBy,
      playlistMusicOrderDirection,
      setPlaylistMusicOrderDirection,
      musicsInPlaylist,
      isFetchingMusics,
      isFetchMusicError,
      isCreatingPlaylist,
      isCreatePlaylistError,
    ]
  );

  return (
    <MusicPlaylistContext.Provider value={value}>
      {children}
    </MusicPlaylistContext.Provider>
  );
};
