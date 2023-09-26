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
  useRef,
  useState,
} from 'react';
import { useMusicPlaylist } from './MusicPlaylistContext';
import { GET_ONE_MUSIC } from '@/apis/customer-apis';
import { LOCAL_CACHE_KEYS } from '@/constants/constants';

const initialContext: MusicPlayerContextValue = {
  playMusic: (musicId: number) => {},
  currentMusic: null,
  toPrevMusic: () => {},
  toNextMusic: () => {},
  shuffleEnabled: false,
  toggleShuffle: () => {},
};

/**
 * 음악 플레이어 컨텍스트
 */
const MusicPlayerContext =
  createContext<MusicPlayerContextValue>(initialContext);

MusicPlayerContext.displayName = 'MusicPlayerContext';

export const useMusicPlayer = () => {
  return useContext(MusicPlayerContext);
};

export const MusicPlayerContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { musicsInPlaylist } = useMusicPlaylist();

  const [currentMusic, setCurrentMusic] = useState<MusicInPlaylist | null>(
    initialContext.currentMusic
  );
  const playMusic = useCallback(
    async (musicId: number) => {
      const matchedMusic = musicsInPlaylist.find(
        (music) => music.musicId === musicId
      );
      if (!matchedMusic) {
        const music = await GET_ONE_MUSIC(musicId);
        setCurrentMusic(music);
      } else {
        setCurrentMusic(matchedMusic);
      }
    },
    [musicsInPlaylist]
  );

  const [shuffleEnabled, setShuffleEnabled] = useState<boolean>(
    initialContext.shuffleEnabled
  );

  /**
   *  로컬스토리지 접근 로직
   * */
  // 셔플을 이전에 사용했다면 켬
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const useShuffleCache: string | null = localStorage.getItem(
        LOCAL_CACHE_KEYS.USE_SHUFFLE
      );
      setShuffleEnabled(useShuffleCache === 'true');
    }
  }, []);

  // 마지막 재생한 음악 가져오기
  useEffect(() => {
    if (musicsInPlaylist && musicsInPlaylist.length > 0) {
      if (typeof localStorage !== 'undefined') {
        const lastPlayedMusicId: string | null = localStorage.getItem(
          LOCAL_CACHE_KEYS.LAST_PLAYED_MUSIC_ID
        );
        if (lastPlayedMusicId) {
          try {
            const matchedMusic = musicsInPlaylist.find(
              (music) => music.musicId === +lastPlayedMusicId
            );
            if (matchedMusic) {
              setTimeout(() => {
                playMusic(matchedMusic.musicId);
              }, 0);
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  }, [musicsInPlaylist]);

  /**
   *  로컬스토리지 접근 로직 끝
   * */

  const getNextRandomMusic = (): MusicInPlaylist => {
    // 플레이리스트에서 아직 재생되지 않은 음악 목록 가져옴
    const notPlayedMusics = musicsInPlaylist.filter(
      (music) => !playedMusicIdList.current.includes(music.musicId)
    );
    let targetMusicArray;

    // 아직 재생하지 않은 음악이 있으면 거기에서 뽑음
    if (notPlayedMusics.length > 0) {
      targetMusicArray = notPlayedMusics;
    } else {
      targetMusicArray = musicsInPlaylist;
    }
    const totalLength = targetMusicArray.length;
    const randomIndex = Math.floor(Math.random() * totalLength);
    return targetMusicArray[randomIndex];
  };

  const toPrevOrNextMusic = useCallback(
    (isDirectionNext: boolean) => {
      if (!musicsInPlaylist || musicsInPlaylist.length < 1) {
        alert('재생목록에 음악이 없습니다.');
        return;
      }
      let nextMusic: MusicInPlaylist;

      // 셔플 사용 시 다음 노래를 랜덤으로 가져온다.
      if (shuffleEnabled) {
        nextMusic = getNextRandomMusic();
      } else if (!currentMusic) {
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
    [musicsInPlaylist, currentMusic, shuffleEnabled]
  );

  const toggleShuffle = useCallback(() => {
    // 로컬스토리지에 셔플을 사용중인지 여부 저장
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        LOCAL_CACHE_KEYS.USE_SHUFFLE,
        String(!shuffleEnabled)
      );
    }
    setShuffleEnabled(!shuffleEnabled);
  }, [shuffleEnabled, setShuffleEnabled]);
  /**
   * shuffle 기능을 위해, 이미 플레이 된 음악 리스트를 저장
   */
  const playedMusicIdList = useRef<Array<number>>([]);

  useEffect(() => {
    if (currentMusic) {
      playedMusicIdList.current.push(currentMusic.musicId);
      if (playedMusicIdList.current.length === musicsInPlaylist.length) {
        // 모두 다 재생이 되었다면 플레이된 음악 리스트 초기화
        playedMusicIdList.current.splice(0, playedMusicIdList.current.length);
      }

      // 로컬스토리지에 마지막으로 재생한 음악 저장
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(
          LOCAL_CACHE_KEYS.LAST_PLAYED_MUSIC_ID,
          String(currentMusic.musicId)
        );
      }
    }
  }, [currentMusic]);

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
      toPrevMusic,
      toNextMusic,
      shuffleEnabled,
      toggleShuffle,
    }),
    [
      playMusic,
      currentMusic,
      toPrevMusic,
      toNextMusic,
      shuffleEnabled,
      toggleShuffle,
    ]
  );

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
