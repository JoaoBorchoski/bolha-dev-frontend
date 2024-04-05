interface IMenuOptionDTO {
  id?: string
  moduleId?: string
  moduleName?: string
  sequence?: string
  label?: string
  route?: string
  icon?: string
  key?: string
  disabled?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export type { IMenuOptionDTO }
