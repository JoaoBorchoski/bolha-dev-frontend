import React, { useState, useEffect } from 'react'
import { Paper } from '@mui/material'
import { CustomTable, FormHeader } from 'components'
import ListIcon from '@mui/icons-material/List'
import { useStyles } from './styles'
import api from 'services/api'
import { IMenuOptionDTO } from 'data/dtos/security/i-menu-option-dto'
import { ITableHeadCellDTO } from 'data/dtos/components/i-table-head-cell-dto'
import { useAlreadyMounted } from 'utils/use-already-mounted';

const headCells: ITableHeadCellDTO[] = [
  {
    id: 'name',
    label: 'Modulo',
    width: 2
  },
  {
    id: 'sequence',
    label: 'Sequência',
    width: 1
  },
  {
    id: 'label',
    label: 'Título',
    width: 4
  },
  {
    id: 'route',
    label: 'Rota',
    width: 4
  },
]

const MenuOptionList: React.FC = () => {
  const [loading, setLoading] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(100)
  const [orderByDirection, setOrderByDirection] = useState(true)
  const [rowsCount, setRowsCount] = useState(0)
  const [menuOptionsList, setMenuOptionsList] = useState<IMenuOptionDTO[]>([])
  const [recordToDelete, setRecordToDelete] = useState<string | null>('')
  const [columnOrder, setColumnOrder] = useState<('ASC' | 'DESC')[]>([])

  const classes = useStyles()
  const alreadyMounted = useAlreadyMounted();

  const loadMenuOptions = async () => {
    setLoading(1)

    await api
      .post('/menu-options/list', {search, page, rowsPerPage, columnOrder})
      .then(async listResponse => {
        const { data } = listResponse.data
        setMenuOptionsList(data)

        await api
          .post('/menu-options/count', {search})
          .then(countResponse => {
            const { count } = countResponse.data.data
            setRowsCount(count)
          })
          .then(() => setLoading(0))
          .catch(error => {
            console.log(error)
          })
      })
      .catch(error => {
        console.log(error)
      })
  }


  const handleDelete = async () => {
    await api
      .delete(`/menu-options/${recordToDelete}`)
      .then(async () => {
        await loadMenuOptions()
      })
      .catch(error => {
        console.log(error.response.data)
      })
  }


  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number,) => {
    setPage(newPage);
  }


  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }


  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!alreadyMounted) {
        loadMenuOptions()
      }
    }, 1000)

    return () => clearTimeout(timeout)
  }, [search])


  useEffect(() => {
    loadMenuOptions()
  }, [orderByDirection, rowsPerPage, page])


  return (
    <Paper elevation={3} className={classes.paper}>

      <FormHeader
        title="Opções de Menu"
        icon={ListIcon}
        newRoute="/menu-options/new"
        helpText="Nesta opção serão informados os menus de opção da aplicação."
      />

      <CustomTable
        headCells={headCells}
        rows={menuOptionsList}
        totalRows={rowsCount}
        handleSearch={setSearch}
        isLoading={loading}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        page={page}
        editRoute="/menu-options/edit"
        handleDelete={handleDelete}
        handleRecordToDelete={setRecordToDelete}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        orderByDirection={orderByDirection}
        setOrderByDirection={setOrderByDirection}
      />

    </Paper>
  )
}

export default MenuOptionList
