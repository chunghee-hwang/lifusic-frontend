import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { useMusicPlaylist } from '@/contexts/MusicPlaylistContext';
import {
  List,
  PauseCircleFilledRounded,
  PlayCircleFilledRounded,
  SkipNextRounded,
  SkipPreviousRounded,
} from '@mui/icons-material';
import { CircularProgress, IconButton, Slider, Stack } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';
import TimeUtils from '@/utils/time';
import { GET_MUSIC_STREAM_URL } from '@/apis/customer-apis';
import { useRouter } from 'next/router';
import pages from '@/constants/pages';

const color = '#fbfbfb';

const Container = styled(Stack)`
  width: 100%;
  background-color: #2a0035;
  color: ${color};
  position: sticky;
  bottom: 0;
  margin-top: 1rem;
  padding: 2rem 0;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const MusicProgressBar = styled(Slider)`
  width: 100%;
  height: 0.5rem;
  position: absolute;
  top: -10px;
  width: 100%;
`;

const MusicTitleAndArtistContainer = styled.div`
  position: relative;
  color: ${color};
  font-weight: 700;
  letter-spacing: 1px;
  width: 15rem;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 1.1rem;
`;

const ThumbnailImage = styled.img`
  height: 70px;
  width: 50px;
  background-size: contain;
  background-repeat: no-repeat;
`;

const CurrentMusicTime = styled.span`
  font-size: 1rem;
  color: white;
  font-weight: 500;
`;

const TotalMusicTime = styled.span`
  font-size: 1rem;
  color: #eeeeee;
  font-weight: 900;
`;

const MusicPlayer: React.FC = () => {
  const { musicsInPlaylist } = useMusicPlaylist();
  const { currentMusic, toPrevMusic, toNextMusic } = useMusicPlayer();

  const [musicProgress, setMusicProgress] = useState(0);
  const musicAudio = useRef<HTMLAudioElement>(null);

  const music = currentMusic ?? musicsInPlaylist?.[0];

  const playMusic = useCallback(async () => {
    if (musicAudio.current) {
      return musicAudio.current
        .play()
        ?.then((_) => {
          setIsMusicPlaying(true);
        })
        .catch((_) => {
          setIsMusicPlaying(false);
        });
    }
    return;
  }, [musicAudio]);

  const pauseMusic = useCallback(() => {
    if (musicAudio.current) {
      if (!musicAudio.current.paused) {
        musicAudio.current.pause();
      }
    }
  }, [musicAudio]);

  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [musicDuration, setMusicDuration] = useState<number>(0);
  const [currentMusicTime, setCurrentMusicTime] = useState<number>(0);
  const musicSrc = useMemo(() => {
    return currentMusic?.fileId
      ? GET_MUSIC_STREAM_URL(currentMusic.fileId)
      : '';
  }, [currentMusic]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (musicAudio.current && isMusicPlaying) {
      timerId = setInterval(() => {
        if (musicAudio.current && isMusicPlaying) {
          setCurrentMusicTime(musicAudio.current.currentTime);
        }
      }, 1000);
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [isMusicPlaying, musicAudio]);

  useEffect(() => {
    if (musicDuration > 0) {
      setMusicProgress(((currentMusicTime ?? 0) / musicDuration) * 100);
    }
  }, [currentMusicTime, musicDuration]);

  const timeInfo = useMemo(() => {
    return (
      <Stack direction={'row'} spacing={2}>
        <CurrentMusicTime>
          {TimeUtils.toHHMMSS(currentMusicTime)}
        </CurrentMusicTime>
        <TotalMusicTime>{TimeUtils.toHHMMSS(musicDuration)}</TotalMusicTime>
      </Stack>
    );
  }, [currentMusicTime, musicDuration]);

  const handleProgressChanged = useCallback(
    (event: Event, value: number | number[], activeThumb: number) => {
      setMusicProgress(value as number);
    },
    []
  );

  const handleProgressChangeComplete = useCallback(
    (event: React.SyntheticEvent | Event, value: number | number[]) => {
      if (currentMusic) {
        if (!isMusicPlaying) {
          playMusic().then((_) => {
            if (musicAudio.current) {
              musicAudio.current.currentTime =
                (musicDuration * (value as number)) / 100;
            }
          });
        } else {
          if (musicAudio.current) {
            musicAudio.current.currentTime =
              (musicDuration * (value as number)) / 100;
          }
        }
      }
    },
    [musicAudio, musicDuration]
  );

  const musicProgressBar = useMemo(() => {
    return (
      <MusicProgressBar
        aria-label={'재생 퍼센티지'}
        value={musicProgress}
        onChange={handleProgressChanged}
        onChangeCommitted={handleProgressChangeComplete}
        size="small"
        color="secondary"
      />
    );
  }, [musicProgress, handleProgressChanged, handleProgressChangeComplete]);
  const router = useRouter();
  return (
    <Container>
      {(!music && (
        <Stack>
          <CircularProgress color="info" /> 음악을 불러오는 중...
        </Stack>
      )) || (
        <>
          {musicProgressBar}
          <Stack direction={'row'}>
            {router.pathname !== pages.MUSIC_PLAYLIST_PAGE.URL && (
              <IconButton
                style={{ color }}
                onClick={(event) => {
                  event.stopPropagation();
                  router.push(pages.MUSIC_PLAYLIST_PAGE.URL);
                }}
              >
                <List />
              </IconButton>
            )}

            {/* 뒤로 이동, 앞으로 이동, 정지 */}
            <Stack direction={'row'} spacing={1}>
              <IconButton
                style={{ color }}
                size="large"
                onClick={() => {
                  toPrevMusic();
                }}
              >
                <SkipPreviousRounded />
              </IconButton>
              <IconButton
                style={{ color }}
                size="large"
                onClick={() => {
                  if (isMusicPlaying) {
                    pauseMusic();
                  } else {
                    playMusic();
                  }
                }}
              >
                {isMusicPlaying ? (
                  <PauseCircleFilledRounded />
                ) : (
                  <PlayCircleFilledRounded />
                )}
              </IconButton>
              <IconButton
                style={{ color }}
                size="large"
                onClick={() => {
                  toNextMusic();
                }}
              >
                <SkipNextRounded />
              </IconButton>
            </Stack>

            <Stack
              direction="row"
              spacing={4}
              marginLeft={5}
              alignItems="center"
              justifyContent="center"
            >
              <ThumbnailImage
                src={music.thumbnailImageUrl ?? ''}
                style={{
                  opacity: !!music.thumbnailImageUrl ? 1 : 0,
                }}
              />

              <MusicTitleAndArtistContainer>
                {music.musicName} - {music.artistName}
              </MusicTitleAndArtistContainer>

              {timeInfo}

              <audio
                autoPlay
                src={musicSrc}
                ref={musicAudio}
                onPause={() => {
                  setIsMusicPlaying(false);
                }}
                onPlay={() => {
                  setIsMusicPlaying(true);
                }}
                onLoadedMetadata={(
                  event: React.SyntheticEvent<HTMLAudioElement, Event>
                ) => {
                  const duration = musicAudio.current?.duration ?? 0;
                  setMusicDuration(duration);
                }}
                onError={() => {
                  setIsMusicPlaying(false);
                }}
              />
            </Stack>
          </Stack>
        </>
      )}
    </Container>
  );
};

export default MusicPlayer;
