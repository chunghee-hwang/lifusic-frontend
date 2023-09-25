import {
  GetMusicsInPlaylistRequest,
  MusicPlaylistContextValue,
  OrderDirection,
} from '@/constants/types/types';
import useAllPlaylistQuery from '@/hooks/customer-api-hooks/all-playlist-query';
import useCreatePlaylistMutation from '@/hooks/customer-api-hooks/create-playlist-mutation';
import useMusicsInPlaylistQuery from '@/hooks/customer-api-hooks/musics-inplaylist-query';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
/**
 * 플레이리스트에 있는 음악 정보를 담은 컨텍스트
 */
const MusicPlaylistContext = createContext<MusicPlaylistContextValue>({
  defaultPlaylist: {
    // 기본 플레이리스트
    id: -1,
    createdAt: 0,
  },
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
  // 플레이리스트 목록 가져오기
  const {
    data: playlists,
    isLoading: isFetchingPlaylist,
    isSuccess: isPlaylistFetched,
  } = useAllPlaylistQuery();

  const { mutate: createPlaylistMutation, isLoading: isCreatingPlaylist } =
    useCreatePlaylistMutation();

  useEffect(() => {
    if (!playlists || playlists?.length < 1) {
      if (!isFetchingPlaylist && isPlaylistFetched && !isCreatingPlaylist) {
        createPlaylistMutation({ name: 'default playlist' });
      }
    }
  }, [playlists, createPlaylistMutation]);

  const [playlistMusicOrderBy, setPlaylistMusicOrderBy] =
    useState<string>('name');
  const [playlistMusicOrderDirection, setPlaylistMusicOrderDirection] =
    useState<OrderDirection>('asc');

  const fetchRequest: GetMusicsInPlaylistRequest = useMemo(() => {
    const defaultPlaylistId = playlists?.[0]?.id;
    if (defaultPlaylistId) {
      return {
        playlistId: defaultPlaylistId,
        orderBy: playlistMusicOrderBy,
        orderDirection: playlistMusicOrderDirection,
      };
    } else {
      return {
        playlistId: -1,
        orderBy: playlistMusicOrderBy,
        orderDirection: playlistMusicOrderDirection,
      };
    }
  }, [playlists, playlistMusicOrderBy, playlistMusicOrderDirection]);

  const {
    data: musicsInPlaylist,
    isLoading: isFetchingMusics,
    isError: isFetchMusicError,
  } = useMusicsInPlaylistQuery(fetchRequest);

  const value = useMemo(
    () => ({
      defaultPlaylist: playlists?.[0] ?? { id: -1, createdAt: 0 },
      musicsInPlaylist: musicsInPlaylist ?? [],
      isFetchingMusics,
      isFetchMusicError,
      playlistMusicOrderBy,
      setPlaylistMusicOrderBy,
      playlistMusicOrderDirection,
      setPlaylistMusicOrderDirection,
    }),
    [
      playlists,
      playlistMusicOrderBy,
      setPlaylistMusicOrderBy,
      playlistMusicOrderDirection,
      setPlaylistMusicOrderDirection,
      musicsInPlaylist,
      isFetchingMusics,
      isFetchMusicError,
    ]
  );

  return (
    <MusicPlaylistContext.Provider value={value}>
      {children}
    </MusicPlaylistContext.Provider>
  );
};
