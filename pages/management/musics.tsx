import useCheckRole from '@/hooks/check-role';
import { Container } from '@/styles/global-style';
import { Alert, CircularProgress, IconButton, Stack } from '@mui/material';
import {
  OrderDirection,
  SearchArtistMusicRequest,
} from '@/constants/types/types';
import useMyMusicsQuery from '@/hooks/admin-api-hooks/my-musics-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import { GET_DOWNLOAD_MUSIC_URL } from '@/apis/admin-apis';
import { Delete, Download } from '@mui/icons-material';
import useDeleteMusicMutation from '@/hooks/admin-api-hooks/delete-music-mutation';
import SortableTable from '@/components/SortableTable';
import { GET_THUMBNAIL_IMAGE_URL } from '@/apis/customer-apis';
export default function MusicManagement() {
  useCheckRole();
  const [searchRequest, setSearchRequest] = useState<SearchArtistMusicRequest>(
    {}
  );
  const {
    data,
    isLoading: isSearching,
    isError: isSearchError,
  } = useMyMusicsQuery(searchRequest);
  const {
    mutate: deleteMusicMutate,
    isSuccess: isDeleteMusicSuccess,
    isError: isDeleteMusicError,
  } = useDeleteMusicMutation();

  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('asc');
  const [orderBy, setOrderBy] = useState('name');
  useEffect(() => {
    const req: SearchArtistMusicRequest = {
      keyword,
      page,
      limit,
      orderBy: 'name',
      orderDirection,
    };
    setSearchRequest(req);
  }, [keyword, page, orderDirection, limit]);

  const [selected, setSelected] = useState<Set<number>>(new Set<number>());

  const onClickDelete = useCallback(() => {
    if (selected.size < 1) {
      alert('최소 하나 이상을 선택해주세요.');
    }
    const yes = confirm('선택하신 음악들을 정말 삭제할까요?');
    if (yes) {
      const musicIds: number[] = Array.from(selected);
      deleteMusicMutate(musicIds);
    }
  }, [selected]);

  useEffect(() => {
    if (isDeleteMusicSuccess) {
      alert('삭제에 성공했습니다.');
    } else if (isDeleteMusicError) {
      alert('삭제에 실패했습니다.');
    }
  }, [isDeleteMusicError, isDeleteMusicSuccess]);

  const DeleteButton = useMemo(
    () =>
      selected.size > 0 ? (
        <IconButton size="small" onClick={onClickDelete}>
          <Delete />
        </IconButton>
      ) : null,

    [selected]
  );

  const headCells = useMemo(
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
        id: 'jobs',
        content: DeleteButton,
        sortable: false,
      },
    ],
    [selected]
  );

  const rows = useMemo(() => {
    return (
      data?.musics?.map((music) => {
        const thumbnailImage = music.thumbnailImageUrl ? (
          <img
            src={GET_THUMBNAIL_IMAGE_URL(music.thumbnailImageUrl)}
            // width="50px"
            height="50px"
            style={{ backgroundSize: 'contain' }}
          />
        ) : null;
        const downloadLink = (
          <IconButton
            href={GET_DOWNLOAD_MUSIC_URL(music.id)}
            target={'_blank'}
            size="small"
          >
            <Download />
          </IconButton>
        );
        return {
          id: music.id,
          columns: [
            {
              id: 'thumbnailImage',
              content: thumbnailImage,
              style: {
                width: '9.75rem',
                height: '50px',
                textAlign: 'center',
              },
            },
            {
              id: 'musicName',
              content: music.name,
              style: {
                width: '25rem',
              },
            },
            {
              id: 'downloadLink',
              content: downloadLink,
            },
          ],
        };
      }) || []
    );
  }, [data]);

  const totalRowsCount = data?.allMusicSize ?? 0;

  return (
    <Container>
      <Stack direction={'row'}>
        <SearchBar
          setKeyword={(keyword) => {
            setPage(1);
            setKeyword(keyword);
          }}
          placeholder="곡명으로 검색"
        />
      </Stack>
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
          isSelectable={true}
          selected={selected}
          setSelected={setSelected}
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
    </Container>
  );
}
