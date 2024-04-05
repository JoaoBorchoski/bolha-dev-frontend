import React, { useState, useEffect } from 'react'
import { Paper } from '@mui/material'
import { CustomTable, FormHeader } from 'components'
import ListIcon from '@mui/icons-material/List'
import { useStyles } from './styles'
import api from 'services/api'
import { ITableHeadCellDTO } from 'data/dtos/components/i-table-head-cell-dto'
import { IUserDTO } from 'data/dtos/security/i-user-dto'
import { useAlreadyMounted } from 'utils/use-already-mounted';

const headCells: ITableHeadCellDTO[] = [
  {
    id: 'userGroupName',
    label: 'Grupo de Usuários',
    width: 3
  },
  {
    id: 'name',
    label: 'Nome',
    width: 4
  },
  {
    id: 'email',
    label: 'EMail',
    width: 2
  },
  {
    id: 'description',
    label: 'Motivo do Bloqueio',
    width: 2
  },
]

const UserList: React.FC = () => {
  const [loading, setLoading] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(100)
  const [orderByDirection, setOrderByDirection] = useState(true)
  const [rowsCount, setRowsCount] = useState(0)
  const [usersList, setUsersList] = useState<IUserDTO[]>([])
  const [recordToDelete, setRecordToDelete] = useState<string | null>('')
  const [columnOrder, setColumnOrder] = useState<('ASC' | 'DESC')[]>([])

  const classes = useStyles()
  const alreadyMounted = useAlreadyMounted();

  const loadUsers = async () => {
    setLoading(1)

    await api
      .post('/users-security/list', {search, page, rowsPerPage, columnOrder})
      .then(async listResponse => {
        const { data } = listResponse.data
        setUsersList(data)

        await api
          .post('/users-security/count', {search})
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
      .delete(`/users-security/${recordToDelete}`)
      .then(async () => {
        await loadUsers()
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
        loadUsers()
      }
    }, 1000)

    return () => clearTimeout(timeout)
  }, [search])


  useEffect(() => {
    loadUsers()
  }, [orderByDirection, rowsPerPage, page])


  return (
    <Paper elevation={3} className={classes.paper}>

      <FormHeader
        title="Usuários"
        icon={ListIcon}
        newRoute="/users/new"
        helpText="Nesta opção serão informados dados do usuário."
      />

      <CustomTable
        headCells={headCells}
        rows={usersList}
        totalRows={rowsCount}
        handleSearch={setSearch}
        isLoading={loading}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        page={page}
        editRoute="/users/edit"
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

export default UserList
