import { SortableTableProps } from '@/constants/types/types';
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

const SortableTable: React.FC<SortableTableProps> = ({
  limit,
  setLimit,
  page,
  setPage,
  orderBy,
  setOrderBy,
  orderDirection,
  setOrderDirection,
  isSelectable,
  selected,
  setSelected,
  headCells,
  rows,
  totalRowsCount,
  usePagination,
}) => {
  const toggleOrderDirection = useCallback(() => {
    setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
    setSelected?.(new Set());
  }, [orderDirection]);

  const handleSelectAllRow = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isSelectable) {
        return;
      }
      if (event.target.checked) {
        setSelected?.(new Set(rows?.map((row) => row.id) || []));
        return;
      }
      setSelected?.(new Set());
    },
    [isSelectable, setSelected, rows]
  );

  const handleRowClick = useCallback(
    (event: React.MouseEvent<unknown>, rowId: number) => {
      if (!isSelectable) {
        return;
      }
      const newSelected = new Set(selected);
      if (newSelected.has(rowId)) {
        newSelected.delete(rowId);
      } else {
        newSelected.add(rowId);
      }
      setSelected?.(newSelected);
    },
    [selected, isSelectable]
  );

  const isSelected = useCallback((id: number) => selected?.has(id), [selected]);

  const isAllSelected = useMemo(() => {
    if (!isSelectable || !selected) {
      return false;
    }
    return (selected.size > 0 && selected.size === rows?.length) ?? 0;
  }, [selected, rows, isSelectable]);

  return useMemo(
    () => (
      <Box sx={{ width: 750 }} marginTop={2}>
        <Paper sx={{ width: '100%' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {isSelectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        onChange={handleSelectAllRow}
                        checked={isAllSelected}
                      />
                    </TableCell>
                  )}
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
                  const isItemSelected = isSelectable && isSelected(row.id);
                  return (
                    <TableRow
                      hover
                      {...(isSelectable && {
                        role: 'checkbox',
                        'aria-checked': isItemSelected,
                        tabIndex: -1,
                        selected: isItemSelected,
                        onClick: (event: React.MouseEvent<unknown>) =>
                          handleRowClick(event, row.id),
                      })}
                      key={row.id}
                      sx={{ cursor: isSelectable ? 'pointer' : 'default' }}
                      {...(row.style && { ...row.style })}
                    >
                      {isSelectable && (
                        <TableCell padding="checkbox">
                          <Checkbox color="primary" checked={isItemSelected} />
                        </TableCell>
                      )}
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
          {usePagination && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={totalRowsCount}
              rowsPerPage={limit ?? 0}
              page={(page ?? 1) - 1}
              onPageChange={(_event: unknown, newPage: number) => {
                setPage?.(newPage + 1);
                setSelected?.(new Set());
              }}
              onRowsPerPageChange={(event) => {
                setPage?.(1);
                setSelected?.(new Set());
                setLimit?.(+event.target.value);
              }}
              showFirstButton
              showLastButton
            />
          )}
        </Paper>
      </Box>
    ),
    [limit, page, orderBy, orderDirection, selected, headCells, rows]
  );
};

export default SortableTable;
