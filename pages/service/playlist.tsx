import SortableTable from '@/components/SortableTable';
import {
  DeleteMusicsInPlaylistRequest,
  GetMusicsInPlaylistRequest,
  HeadCell,
  OrderDirection,
} from '@/constants/types/types';
import useCheckRole from '@/hooks/check-role';
import useAllPlaylistQuery from '@/hooks/customer-api-hooks/all-playlist-query';
import useCreatePlaylistMutation from '@/hooks/customer-api-hooks/create-playlist-mutation';
import useDeleteMusicsInPlaylistMutation from '@/hooks/customer-api-hooks/delete-musics-in-playlist-mutation';
import useMusicsInPlaylistQuery from '@/hooks/customer-api-hooks/musics-inplaylist-query';
import { Delete, PlayCircle } from '@mui/icons-material';
import { Alert, CircularProgress, IconButton, Stack } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function Playlist() {
  useCheckRole();
  const [orderBy, setOrderBy] = useState<string>('name');
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('asc');
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

  const fetchRequest: GetMusicsInPlaylistRequest = useMemo(() => {
    const defaultPlaylistId = playlists?.[0]?.id;
    if (defaultPlaylistId) {
      return {
        playlistId: defaultPlaylistId,
        orderBy,
        orderDirection,
      };
    } else {
      return {
        playlistId: -1,
        orderBy,
        orderDirection,
      };
    }
  }, [playlists, orderBy, orderDirection]);

  const {
    data: musicsInPlaylist,
    isLoading: isFetchingMusics,
    isError: isFetchingError,
  } = useMusicsInPlaylistQuery(fetchRequest);

  const rows = useMemo(
    () =>
      (musicsInPlaylist ?? []).map((music) => {
        return {
          id: music.musicInPlaylistId,
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
              content: music.musicName,
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
                  }}
                >
                  <PlayCircle />
                </IconButton>
              ),
            },
          ],
        };
      }),
    [musicsInPlaylist]
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

  return (
    <Stack
      direction={'column'}
      marginTop={1}
      alignItems={'center'}
      justifyContent={'flex-start'}
    >
      {!isFetchingMusics && totalRowsCount > 0 && (
        <SortableTable
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          orderDirection={orderDirection}
          setOrderDirection={setOrderDirection}
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
      {!isFetchingError && !isFetchingMusics && totalRowsCount < 1 && (
        <Stack marginTop={10}>
          플레이리스트에 음악이 없습니다. [음악 찾기] 메뉴에서 담아주세요.
        </Stack>
      )}
      {isFetchingError && (
        <Stack marginTop={10}>
          <Alert severity="error">음악을 불러오는데 실패했습니다.</Alert>
        </Stack>
      )}
    </Stack>
  );
}
