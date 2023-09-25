import {
  MusicInPlaylist,
  MusicPlayerContextValue,
} from '@/constants/types/types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useMusicPlaylist } from './MusicPlaylistContext';

/**
 * 음악 플레이어 컨텍스트
 */
const MusicPlayerContext = createContext<MusicPlayerContextValue>({
  playMusic: (musicId: number) => {},
  currentMusic: null,
  currentPlaylist: {
    id: -1,
    createdAt: 0,
  },
  toPrevMusic: () => {},
  toNextMusic: () => {},
});

MusicPlayerContext.displayName = 'MusicPlayerContext';

export const useMusicPlayer = () => {
  return useContext(MusicPlayerContext);
};

export const MusicPlayerContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { defaultPlaylist, musicsInPlaylist } = useMusicPlaylist();

  const [currentMusic, setCurrentMusic] = useState<MusicInPlaylist | null>(
    null
  );
  const playMusic = useCallback(
    (musicId: number) => {
      if (!musicsInPlaylist || musicsInPlaylist.length < 1) {
        alert('재생 요청에 실패하였습니다.');
        return;
      }
      const matchedMusic = musicsInPlaylist.find(
        (music) => music.musicId === musicId
      );
      if (!matchedMusic) {
        alert('재생 요청에 실패하였습니다.');
      } else {
        setCurrentMusic(matchedMusic);
      }
    },
    [musicsInPlaylist]
  );
  const toPrevOrNextMusic = useCallback(
    (isDirectionNext: boolean) => {
      if (!musicsInPlaylist || musicsInPlaylist.length < 1) {
        alert('재생목록에 음악이 없습니다.');
        return;
      }
      let nextMusic;
      if (!currentMusic) {
        nextMusic = musicsInPlaylist[0];
      } else {
        const idx = musicsInPlaylist.findIndex(
          (m) => m.musicId === currentMusic.musicId
        );
        if (idx === -1) {
          nextMusic = musicsInPlaylist[0];
        } else {
          if (isDirectionNext) {
            nextMusic = musicsInPlaylist[(idx + 1) % musicsInPlaylist.length];
          } else {
            let nextIdx = idx - 1;
            if (nextIdx < 0) {
              nextIdx = musicsInPlaylist.length - 1;
            }
            nextMusic = musicsInPlaylist[nextIdx];
          }
        }
      }
      setCurrentMusic(nextMusic);
    },
    [musicsInPlaylist, currentMusic]
  );

  useEffect(() => {
    if (!currentMusic && musicsInPlaylist && musicsInPlaylist.length > 0) {
      setCurrentMusic(musicsInPlaylist[0]);
    }
  }, [musicsInPlaylist, currentMusic]);

  const toPrevMusic = useCallback(() => {
    toPrevOrNextMusic(false);
  }, [toPrevOrNextMusic]);

  const toNextMusic = useCallback(() => {
    toPrevOrNextMusic(true);
  }, [toPrevOrNextMusic]);

  const value: MusicPlayerContextValue = useMemo(
    () => ({
      playMusic,
      currentMusic,
      currentPlaylist: defaultPlaylist,
      toPrevMusic,
      toNextMusic,
    }),
    [playMusic, currentMusic, defaultPlaylist, toPrevMusic, toNextMusic]
  );

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
