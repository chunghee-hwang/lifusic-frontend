import useCheckRole from '@/hooks/check-role';
import { Container } from '@/styles/global-style';
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
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

  const toggleOrderDirection = useCallback(() => {
    setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
    setSelected(new Set());
  }, [orderDirection]);

  const [selected, setSelected] = useState<Set<number>>(new Set<number>());
  const isSelected = useCallback((id: number) => selected.has(id), [selected]);

  const handleSelectAllRow = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(new Set(rows?.map((row) => row.id) || []));
      return;
    }
    setSelected(new Set());
  };

  const handleRowClick = useCallback(
    (event: React.MouseEvent<unknown>, rowId: number) => {
      const newSelected = new Set(selected);
      if (newSelected.has(rowId)) {
        newSelected.delete(rowId);
      } else {
        newSelected.add(rowId);
      }
      setSelected(newSelected);
    },
    [selected]
  );

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
    return data?.musics?.map((music) => {
      const thumbnailImage = music.thumbnailImageUrl ? (
        <img src={music.thumbnailImageUrl} width="50px" height="50px" />
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
            content: thumbnailImage,
            style: {
              width: 'auto',
              height: '3.125rem',
            },
          },
          {
            content: music.name,
            style: {
              width: '25rem',
            },
          },
          {
            content: downloadLink,
            style: {},
          },
        ],
      };
    });
  }, [data]);

  const totalRowsCount = data?.allMusicSize ?? 0;

  const isAllSelected = useMemo(
    () => (selected.size > 0 && selected.size === rows?.length) ?? 0,
    [selected, rows]
  );

  return (
    <Container>
      <Stack direction={'row'}>
        <SearchBar setKeyword={setKeyword} placeholder="곡명으로 검색" />
      </Stack>

      <Box sx={{ width: 750 }} marginTop={2}>
        <Paper sx={{ width: '100%' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      onChange={handleSelectAllRow}
                      checked={isAllSelected}
                    />
                  </TableCell>
                  {headCells.map((headCell) => {
                    const isSorted =
                      headCell.sortable && orderBy === headCell.id;
                    return (
                      <TableCell
                        key={headCell.id}
                        sortDirection={isSorted ? orderDirection : false}
                        align="justify"
                        padding="none"
                      >
                        {(headCell.sortable && (
                          <TableSortLabel
                            active={isSorted}
                            direction={isSorted ? orderDirection : 'asc'}
                            onClick={() => {
                              setOrderBy(headCell.id);
                              toggleOrderDirection();
                            }}
                          >
                            {headCell.content}
                          </TableSortLabel>
                        )) ||
                          headCell.content}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows?.map((row) => {
                  const isItemSelected = isSelected(row.id);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                      onClick={(event) => handleRowClick(event, row.id)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox color="primary" checked={isItemSelected} />
                      </TableCell>
                      {row.columns.map((column) => {
                        return (
                          <TableCell padding="none" style={column.style}>
                            {column.content}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={totalRowsCount}
            rowsPerPage={limit}
            page={page - 1}
            onPageChange={(event: unknown, newPage: number) => {
              setPage(newPage + 1);
              setSelected(new Set());
            }}
            onRowsPerPageChange={(event) => {
              setPage(1);
              setLimit(+event.target.value);
            }}
          />
        </Paper>
      </Box>
    </Container>
  );
}
