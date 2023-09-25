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
  isSelectable: selectable,
  selected,
  setSelected,
  headCells,
  rows,
  totalRowsCount,
}) => {
  const toggleOrderDirection = useCallback(() => {
    setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
    setSelected?.(new Set());
  }, [orderDirection]);

  const handleSelectAllRow = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!selectable) {
        return;
      }
      if (event.target.checked) {
        setSelected?.(new Set(rows?.map((row) => row.id) || []));
        return;
      }
      setSelected?.(new Set());
    },
    [selectable, setSelected]
  );

  const handleRowClick = useCallback(
    (event: React.MouseEvent<unknown>, rowId: number) => {
      if (!selectable) {
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
    [selected, selectable]
  );

  const isSelected = useCallback((id: number) => selected?.has(id), [selected]);

  const isAllSelected = useMemo(() => {
    if (!selectable || !selected) {
      return false;
    }
    return (selected.size > 0 && selected.size === rows?.length) ?? 0;
  }, [selected, rows, selectable]);

  return useMemo(
    () => (
      <Box sx={{ width: 750 }} marginTop={2}>
        <Paper sx={{ width: '100%' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {selectable && (
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
                  const isItemSelected = selectable && isSelected(row.id);
                  return (
                    <TableRow
                      hover
                      {...(selectable && {
                        role: 'checkbox',
                        'aria-checked': isItemSelected,
                        tabIndex: -1,
                        selected: isItemSelected,
                        onClick: (event: React.MouseEvent<unknown>) =>
                          handleRowClick(event, row.id),
                      })}
                      key={row.id}
                      sx={{ cursor: selectable ? 'pointer' : 'default' }}
                    >
                      {selectable && (
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={totalRowsCount}
            rowsPerPage={limit}
            page={page - 1}
            onPageChange={(_event: unknown, newPage: number) => {
              setPage(newPage + 1);
              setSelected?.(new Set());
            }}
            onRowsPerPageChange={(event) => {
              setPage(1);
              setSelected?.(new Set());
              setLimit(+event.target.value);
            }}
            showFirstButton
            showLastButton
          />
        </Paper>
      </Box>
    ),
    [limit, page, orderBy, orderDirection, selected, headCells, rows]
  );
};

export default SortableTable;
