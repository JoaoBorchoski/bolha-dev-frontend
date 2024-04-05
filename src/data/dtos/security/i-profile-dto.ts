import { IProfileOptionDTO } from 'data/dtos/security/i-profile-option-dto'

interface IProfileDTO {
  id?: string
  userGroupId?: string
  name?: string
  disabled?: boolean
  menuOptions?: IProfileOptionDTO[]
  createdAt?: Date
  updatedAt?: Date
}

export type { IProfileDTO }
