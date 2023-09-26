import { GET_THUMBNAIL_IMAGE_URL } from '@/apis/customer-apis';
import MusicPlayer from '@/components/MusicPlayer';
import SearchBar from '@/components/SearchBar';
import SortableTable from '@/components/SortableTable';
import { PLAYLISTS } from '@/constants/query-keys';
import {
  AddMusicToPlaylistRequest,
  HeadCell,
  OrderDirection,
  Playlist,
  Row,
  SearchMusicRequest,
} from '@/constants/types/types';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { useMusicPlaylist } from '@/contexts/MusicPlaylistContext';
import useCheckRole from '@/hooks/check-role';
import useAddMusicToPlaylistMutation from '@/hooks/customer-api-hooks/add-music-to-playlist-mutation';
import useSearchMusicQuery from '@/hooks/customer-api-hooks/search-music-query';
import { PlayCircle } from '@mui/icons-material';
import { Alert, CircularProgress, IconButton, Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';

const Container = styled(Stack)`
  position: relative;
  flex-direction: column;
  height: calc(100% - 104.8px);
  align-items: center;
  justify-content: space-between;
  overflow-x: hidden;
  margin-top: 2rem;
`;

export default function CustomerMusics() {
  useCheckRole();
  const { enqueueSnackbar } = useSnackbar();
  const [keyword, setKeyword] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('name');
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('asc');
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
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
        id: 'addToContentButton',
        content: '',
        sortable: false,
      },
    ],
    []
  );
  const searchRequest: SearchMusicRequest = useMemo(
    () => ({
      keyword,
      orderBy,
      orderDirection,
      limit,
      page,
    }),
    [keyword, orderBy, orderDirection, limit, page]
  );

  const {
    data: searchResult,
    isLoading: isSearching,
    isError: isSearchError,
  } = useSearchMusicQuery(searchRequest);

  const rows: Row[] = useMemo(() => {
    return (
      searchResult?.musics?.map((music) => ({
        id: music.id,
        columns: [
          {
            id: 'thumbnailImage',
            content: music.thumbnailImageUrl ? (
              <img
                src={GET_THUMBNAIL_IMAGE_URL(music.thumbnailImageUrl)}
                height={'50px'}
              />
            ) : (
              <div></div>
            ),
            style: {
              width: '5rem',
              height: '50px',
              textAlign: 'center',
            },
          },
          {
            id: 'name',
            content: music.name,
            style: {
              minWidth: '10rem',
            },
          },
          {
            id: 'artistName',
            content: music.artistName,
          },
          {
            id: 'addToPlaylistButton',
            content: (
              <IconButton
                onClick={(event: React.MouseEvent<unknown>) =>
                  handlePlayButtonClick(event, music.id)
                }
              >
                <PlayCircle />
              </IconButton>
            ),
          },
        ],
      })) || []
    );
  }, [searchResult]);

  const totalRowsCount = useMemo(
    () => searchResult?.allMusicSize ?? 0,
    [searchResult]
  );

  const {
    mutate: addMusicToPlaylistMutation,
    isSuccess: isAddMusicSuccess,
    isError: isAddMusicError,
    isLoading: isAddMusicLoading,
  } = useAddMusicToPlaylistMutation();

  const { defaultPlaylist, isFetchingMusics: isFetchingMusicAndPlaylist } =
    useMusicPlaylist();
  const queryClient = useQueryClient();
  const { playMusic } = useMusicPlayer();
  const savedDefaultPlaylist = useRef<Playlist>();
  useEffect(() => {
    if (defaultPlaylist) {
      savedDefaultPlaylist.current = { ...defaultPlaylist };
    }
  }, [defaultPlaylist]);

  const handlePlayButtonClick = (
    event: React.MouseEvent<unknown>,
    musicId: number
  ) => {
    event.stopPropagation();
    const playlistId = savedDefaultPlaylist.current?.id;
    if (!playlistId || !musicId) {
      queryClient.invalidateQueries(PLAYLISTS);
      enqueueSnackbar(
        '음악 재생에 실패하였습니다. 새로고침 후 다시 시도 해주세요.',
        {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'left' },
        }
      );
      return;
    }
    const request: AddMusicToPlaylistRequest = {
      musicId,
      playlistId,
    };
    addMusicToPlaylistMutation(request);
    playMusic(musicId);
  };

  useEffect(() => {
    if (!isAddMusicLoading) {
      if (isAddMusicError) {
        enqueueSnackbar('음악을 재생목록에 추가하는데에 실패하였습니다', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'left' },
        });
      } else if (isAddMusicSuccess) {
        enqueueSnackbar('재생목록에 음악을 추가하였습니다.', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'left' },
        });
      }
    }
  }, [isAddMusicError, isAddMusicLoading, isAddMusicSuccess]);

  if (isFetchingMusicAndPlaylist || defaultPlaylist === null) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <SearchBar
        setKeyword={(keyword) => {
          setPage(1);
          setKeyword(keyword);
        }}
        placeholder="곡명 또는 아티스트명으로 검색"
      />
      {!isSearching && totalRowsCount > 0 && (
        <SortableTable
          limit={limit}
          setLimit={setLimit}
          page={page}
          setPage={setPage}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          orderDirection={orderDirection}
          setOrderDirection={setOrderDirection}
          isSelectable={false}
          headCells={headCells}
          rows={rows}
          totalRowsCount={totalRowsCount}
          usePagination
        />
      )}
      {isSearching && (
        <Stack marginTop={10}>
          <CircularProgress color="success" />
        </Stack>
      )}
      {!isSearchError && !isSearching && totalRowsCount < 1 && (
        <Stack marginTop={10}>검색 결과가 없습니다.</Stack>
      )}
      {isSearchError && (
        <Stack marginTop={10}>
          <Alert severity="error">
            검색에 실패하였습니다. 다시 시도해주세요.
          </Alert>
        </Stack>
      )}
      <MusicPlayer />
    </Container>
  );
}
