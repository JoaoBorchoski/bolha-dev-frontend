import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Paper, InputBase, TablePagination, LinearProgress } from '@mui/material'
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, TableSortLabel } from '@mui/material'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import { ITableHeadCellDTO } from 'data/dtos/components/i-table-head-cell-dto'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check';
import { useStyles } from './styles'

type Props = {
  headCells: ITableHeadCellDTO[],
  rows: any[],
  totalRows: number,
  handleSearch: React.Dispatch<React.SetStateAction<string>>,
  isLoading: number,
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => Promise<void>,
  rowsPerPage: number,
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number,) => void,
  page: number,
  editRoute: string,
  handleDelete: () => void,
  handleRecordToDelete: React.Dispatch<React.SetStateAction<string>>,
  orderByDirection: boolean,
  setOrderByDirection: React.Dispatch<React.SetStateAction<boolean>>
  columnOrder: ('ASC' | 'DESC')[],
  setColumnOrder: React.Dispatch<React.SetStateAction<('ASC' | 'DESC')[]>>
}

const formatString = (fieldContent: string, format: string) => {
  let output = fieldContent

  if ((typeof fieldContent == 'boolean') && (fieldContent == true)) {
    output = 'X'
  }

  switch (format) {
    case 'cnpj':
      output = output.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  }

  return output
}

const CustomTable: React.FC<Props> = ({ 
  headCells, 
  rows, 
  totalRows,
  handleSearch, 
  isLoading,
  handleChangeRowsPerPage,
  rowsPerPage,
  handleChangePage,
  page,
  editRoute,
  handleDelete,
  handleRecordToDelete,
  orderByDirection,
  setOrderByDirection,
  columnOrder,
  setColumnOrder
}: Props) => {
  const [open, setOpen] = useState(false)
  
  const classes = useStyles()
  const history = useHistory()
  const defaultWidth = (headCells.length > 1 ? 100 / headCells.length : 100)

  const handleClickOpen = (record: string) => {
    setOpen(true)
    handleRecordToDelete(record)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseDelete = () => {
    setOpen(false)
    handleDelete()
  }

  const handleSortChange = (index: number) => { 
    columnOrder[index] = columnOrder[index] === 'ASC' ? 'DESC' : 'ASC' 

    setColumnOrder(columnOrder)
    setOrderByDirection(!orderByDirection)
  }

  useEffect(() => {
    const sortArray: Array<('ASC' | 'DESC')> = headCells.map(() => 'ASC')

    setColumnOrder(sortArray)
  }, [headCells])

  return (
    <>
      <div className={classes.search}>
        <InputBase
          placeholder={'Informe o termo de busca aqui...'}
          className={classes.inputInput}
          onChange={ (e) => { handleSearch(e.target.value) } }
        />
      </div>

      <div className={ isLoading === 1 ? classes.linearProgressOn : classes.linearProgressOff }>
        <LinearProgress />
      </div>

      <Paper className={classes.tablePaper}>
        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader>

            <TableHead>
              <TableRow key={0}>
                <TableCell className={classes.rowTableIcon}>&nbsp;</TableCell>
                <TableCell className={classes.rowTableIcon}>&nbsp;</TableCell>

                {headCells.map((headCell, index) => (
                  <TableCell 
                    align="left" 
                    style={{ 
                      width: `${typeof(headCell.width) !== 'undefined' ? (headCell.width * 100 / 11) : defaultWidth}%`, 
                      fontWeight: 'bold',
                      color: '#1F0ADF !important'
                    }}
                  >
                    <TableSortLabel
                      active={true}
                      direction={columnOrder[index] === 'ASC' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange(index)}
                      style={{ 
                        fontWeight: 'bold',
                        color: '#1F0ADF !important'
                      }}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}

              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => (
              <TableRow hover key={row.id}>
                <TableCell className={classes.rowTableIcon}><EditIcon className={classes.tableIcon} onClick={() => history.push(`${editRoute}/${row.id}`)} /></TableCell>
                <TableCell className={classes.rowTableIcon}><DeleteIcon className={classes.tableIcon} onClick={() => handleClickOpen(row.id) } /></TableCell>
                {headCells.map((headCell) => (
                  <TableCell align="left" style={{ minWidth: 100 }}>
                    {
                      headCell.id.includes('.') 
                      ? formatString(row[headCell.id.split('.')[0]][headCell.id.split('.')[1]], headCell.format ?? '')
                      : formatString(row[headCell.id], headCell.format ?? '') == 'X' ? <CheckIcon className={classes.tableIcon} /> : formatString(row[headCell.id], headCell.format ?? '')
                    }
                  </TableCell>
                ))}
              </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página"
          labelDisplayedRows={({ from, to, count }) => `Página ${page + 1}, ${from}-${to} de ${count}`}
          sx={{
            '.MuiSvgIcon-root': {
              position: 'relative'
            }
          }}
        />
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Exclusão de Registro</DialogTitle>

        <DialogContent style={{ width: '500px' }}>
          <DialogContentText id="alert-dialog-description">
            Deseja realmente excluir o registro?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="contained">Não</Button>
          <Button onClick={handleCloseDelete} variant="contained">Sim</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export { CustomTable }
