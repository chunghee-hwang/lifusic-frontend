import SearchBar from '@/components/SearchBar';
import SortableTable from '@/components/SortableTable';
import {
  AddMusicToPlaylistRequest,
  HeadCell,
  OrderDirection,
  Row,
  SearchMusicRequest,
} from '@/constants/types/types';
import useCheckRole from '@/hooks/check-role';
import useAddMusicToPlaylistMutation from '@/hooks/customer-api-hooks/add-music-to-playlist-mutation';
import useAllPlaylistQuery from '@/hooks/customer-api-hooks/all-playlist-query';
import useCreatePlaylistMutation from '@/hooks/customer-api-hooks/create-playlist-mutation';
import useSearchMusicQuery from '@/hooks/customer-api-hooks/search-music-query';
import { Container } from '@/styles/global-style';
import { PlayCircle } from '@mui/icons-material';
import { Alert, CircularProgress, IconButton, Stack } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function CustomerMusics() {
  useCheckRole();

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
              <img src={music.thumbnailImageUrl} height={'50px'} />
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
    isSuccess: isAddSuccess,
    isError: isAddError,
  } = useAddMusicToPlaylistMutation();

  const {
    data: playlists,
    isLoading: isFetchingPlaylist,
    isSuccess: isPlaylistFetched,
  } = useAllPlaylistQuery();

  const { mutate: createPlaylistMutation, isLoading: isCreatingPlaylist } =
    useCreatePlaylistMutation();

  const handlePlayButtonClick = useCallback(
    (event: React.MouseEvent<unknown>, musicId: number) => {
      event.stopPropagation();
      const playlistId = playlists?.[0]?.id;
      if (!playlistId || !musicId) {
        return;
      }
      const request: AddMusicToPlaylistRequest = {
        musicId,
        playlistId,
      };
      addMusicToPlaylistMutation(request);
    },
    [playlists, addMusicToPlaylistMutation]
  );

  useEffect(() => {
    if (!playlists || playlists?.length < 1) {
      if (!isFetchingPlaylist && isPlaylistFetched && !isCreatingPlaylist) {
        createPlaylistMutation({ name: 'default playlist' });
      }
    }
  }, [playlists, createPlaylistMutation]);

  useEffect(() => {
    if (isAddSuccess) {
      alert('음악을 플레이리스트에 추가하였습니다.');
    } else if (isAddError) {
      alert('음악을 플레이리스트에 추가하지 못 했습니다.');
    }
  }, [isAddSuccess, isAddError]);

  return (
    <Container>
      <SearchBar setKeyword={setKeyword} />
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
    </Container>
  );
}
