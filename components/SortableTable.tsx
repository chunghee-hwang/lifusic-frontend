import { OrderDirection } from '@/constants/types/types';
import {
  Box,
  Paper,
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
import { useCallback, useMemo } from 'react';

type HeadCell = {
  id: string;
  content: any;
  sortable: boolean;
};

type Column = {
  id: number | string;
  content: any;
  style?: object;
};

type Row = {
  id: number;
  columns: Column[];
};

type SortableTableProps = {
  limit: number; // 한 페이지당 몇 개 보여줄 건지
  setLimit: (limit: number) => void;
  page: number; // 현재 페이지
  setPage: (page: number) => void;
  orderBy: string; // 정렬할 항목
  setOrderBy: (orderBy: string) => void;
  orderDirection: OrderDirection; // 오름차순 or 내림차순
  setOrderDirection: (orderDirection: OrderDirection) => void;
  selected: Set<number>; // 선택된 항목의 아이디
  setSelected: (selected: Set<number>) => void;
  headCells: HeadCell[]; // 헤더에 보여줄 컬럼들
  rows: Row[]; // 항목들
  totalRowsCount: number; // 전체 항목 개수
};

const SortableTable: React.FC<SortableTableProps> = ({
  limit,
  setLimit,
  page,
  setPage,
  orderBy,
  setOrderBy,
  orderDirection,
  setOrderDirection,
  selected,
  setSelected,
  headCells,
  rows,
  totalRowsCount,
}) => {
  const toggleOrderDirection = useCallback(() => {
    setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
    setSelected(new Set());
  }, [orderDirection]);

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

  const isSelected = useCallback((id: number) => selected.has(id), [selected]);

  const isAllSelected = useMemo(
    () => (selected.size > 0 && selected.size === rows?.length) ?? 0,
    [selected, rows]
  );

  return useMemo(
    () => (
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
                          <TableCell
                            padding="none"
                            style={column.style}
                            key={column.id}
                          >
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
            onPageChange={(_event: unknown, newPage: number) => {
              setPage(newPage + 1);
              setSelected(new Set());
            }}
            onRowsPerPageChange={(event) => {
              setPage(1);
              setSelected(new Set());
              setLimit(+event.target.value);
            }}
          />
        </Paper>
      </Box>
    ),
    [limit, page, orderBy, orderDirection, selected, headCells, rows]
  );
};

export default SortableTable;
