import React, { useState, useEffect } from 'react'
import { Paper } from '@mui/material'
import { CustomTable, FormHeader } from 'components'
import ListIcon from '@mui/icons-material/List'
import { useStyles } from './styles'
import api from 'services/api'
import { IUserProfileDTO } from 'data/dtos/security/i-user-profile-dto'
import { ITableHeadCellDTO } from 'data/dtos/components/i-table-head-cell-dto'
import { useAlreadyMounted } from 'utils/use-already-mounted';

const headCells: ITableHeadCellDTO[] = [
  {
    id: 'name',
    label: 'Usuário',
    width: 6
  },
  {
    id: 'name',
    label: 'Perfil',
    width: 5
  },
]

const UserProfileList: React.FC = () => {
  const [loading, setLoading] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(100)
  const [orderByDirection, setOrderByDirection] = useState(true)
  const [rowsCount, setRowsCount] = useState(0)
  const [usersProfilesList, setUsersProfilesList] = useState<IUserProfileDTO[]>([])
  const [recordToDelete, setRecordToDelete] = useState<string | null>('')
  const [columnOrder, setColumnOrder] = useState<('ASC' | 'DESC')[]>([])

  const classes = useStyles()
  const alreadyMounted = useAlreadyMounted();

  const loadUsersProfiles = async () => {
    setLoading(1)

    await api
      .post('/users-profiles/list', {search, page, rowsPerPage, columnOrder})
      .then(async listResponse => {
        const { data } = listResponse.data
        setUsersProfilesList(data)

        await api
          .post('/users-profiles/count', {search})
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
      .delete(`/users-profiles/${recordToDelete}`)
      .then(async () => {
        await loadUsersProfiles()
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
        loadUsersProfiles()
      }
    }, 1000)

    return () => clearTimeout(timeout)
  }, [search])


  useEffect(() => {
    loadUsersProfiles()
  }, [orderByDirection, rowsPerPage, page])


  return (
    <Paper elevation={3} className={classes.paper}>

      <FormHeader
        title="Usuários x Perfis"
        icon={ListIcon}
        newRoute="/users-profiles/new"
        helpText="Nesta opção serão relacionados os perfis a cada usuário que acessa a aplicação."
      />

      <CustomTable
        headCells={headCells}
        rows={usersProfilesList}
        totalRows={rowsCount}
        handleSearch={setSearch}
        isLoading={loading}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        page={page}
        editRoute="/users-profiles/edit"
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

export default UserProfileList
