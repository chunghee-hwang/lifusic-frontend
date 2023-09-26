import MusicPlayer from '@/components/MusicPlayer';
import SortableTable from '@/components/SortableTable';
import {
  DeleteMusicsInPlaylistRequest,
  HeadCell,
} from '@/constants/types/types';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { useMusicPlaylist } from '@/contexts/MusicPlaylistContext';
import useCheckRole from '@/hooks/check-role';
import useDeleteMusicsInPlaylistMutation from '@/hooks/customer-api-hooks/delete-musics-in-playlist-mutation';
import { Delete, PlayCircle } from '@mui/icons-material';
import { Alert, CircularProgress, IconButton, Stack } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { styled } from 'styled-components';

const Container = styled(Stack)`
  position: relative;
  flex-direction: column;
  height: calc(100% - 69.7px);
  justify-content: space-between;
  overflow-x: hidden;
`;

export default function Playlist() {
  useCheckRole();
  const {
    playlistMusicOrderBy,
    setPlaylistMusicOrderBy,
    playlistMusicOrderDirection,
    setPlaylistMusicOrderDirection,
    musicsInPlaylist,
    isFetchingMusics,
    isFetchMusicError,
  } = useMusicPlaylist();

  const { playMusic, currentMusic } = useMusicPlayer();
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const headCells: HeadCell[] = useMemo(
    () => [
      {
        id: 'thumbnailImage',
        content: '',
        sortable: false,
      },
      {
        id: 'name',
        content: '곡명',
        sortable: true,
      },
      {
        id: 'artistName',
        content: '아티스트명',
        sortable: true,
      },
      {
        id: 'jobs',
        content: selected.size > 0 && (
          <IconButton
            onClick={(event: React.MouseEvent<unknown>) => {
              event.stopPropagation();
              handleDeleteMusicsInPlaylist();
            }}
          >
            <Delete />
          </IconButton>
        ),
        sortable: false,
      },
    ],
    [selected]
  );

  const rows = useMemo(
    () =>
      (musicsInPlaylist ?? []).map((music, idx) => {
        const isPlayedMusic = music.musicId === currentMusic?.musicId;
        return {
          id: music.musicInPlaylistId ?? idx,
          columns: [
            {
              id: 'thumbnailImage',
              content: music.thumbnailImageUrl ? (
                <img src={music.thumbnailImageUrl} height="50px" />
              ) : (
                <div></div>
              ),
            },
            {
              id: 'name',
              content: isPlayedMusic ? (
                <b>{music.musicName}</b>
              ) : (
                music.musicName
              ),
            },
            {
              id: 'artistName',
              content: music.artistName,
            },
            {
              id: 'playMusic',
              content: (
                <IconButton
                  onClick={(event: React.MouseEvent<unknown>) => {
                    event.stopPropagation();
                    handlePlayButtonClick(music.musicId);
                  }}
                >
                  <PlayCircle />
                </IconButton>
              ),
            },
          ],
        };
      }),
    [musicsInPlaylist, currentMusic]
  );

  const totalRowsCount = useMemo(() => {
    return musicsInPlaylist?.length ?? 0;
  }, [musicsInPlaylist]);

  const {
    mutate: deleteMusicMutate,
    isSuccess: isDeleteMusicSuccess,
    isError: isDeleteMusicError,
  } = useDeleteMusicsInPlaylistMutation();

  const handleDeleteMusicsInPlaylist = useCallback(() => {
    const yes = confirm(
      '선택하신 음악(들)을 플레이리스트에서 삭제하시겠습니까?'
    );
    if (yes) {
      const deleteMusicsInRequest: DeleteMusicsInPlaylistRequest = {
        musicInPlaylistIds: Array.from(selected),
      };
      deleteMusicMutate(deleteMusicsInRequest);
    }
  }, [selected]);

  useEffect(() => {
    if (isDeleteMusicSuccess) {
      alert('플레이리스트에서 음악을 삭제했습니다.');
    } else if (isDeleteMusicError) {
      alert('플레이리스트에서 음악을 삭제하던도중 에러가 발생했습니다.');
    }
  }, [isDeleteMusicSuccess, isDeleteMusicError]);

  const handlePlayButtonClick = useCallback(
    (musicId: number) => {
      playMusic(musicId);
    },
    [playMusic]
  );

  return (
    <Container>
      <Stack
        direction={'column'}
        marginTop={1}
        alignItems={'center'}
        justifyContent={'flex-start'}
      >
        {!isFetchingMusics && totalRowsCount > 0 && (
          <SortableTable
            orderBy={playlistMusicOrderBy}
            setOrderBy={setPlaylistMusicOrderBy}
            orderDirection={playlistMusicOrderDirection}
            setOrderDirection={setPlaylistMusicOrderDirection}
            isSelectable
            selected={selected}
            setSelected={setSelected}
            headCells={headCells}
            rows={rows}
            totalRowsCount={totalRowsCount}
            usePagination={false}
          />
        )}

        {isFetchingMusics && (
          <Stack marginTop={10}>
            <CircularProgress color="success" />
          </Stack>
        )}
        {!isFetchMusicError && !isFetchingMusics && totalRowsCount < 1 && (
          <Stack marginTop={10}>
            플레이리스트에 음악이 없습니다. [음악 찾기] 메뉴에서 담아주세요.
          </Stack>
        )}
        {isFetchMusicError && (
          <Stack marginTop={10}>
            <Alert severity="error">음악을 불러오는데 실패했습니다.</Alert>
          </Stack>
        )}
      </Stack>

      <MusicPlayer />
    </Container>
  );
}
