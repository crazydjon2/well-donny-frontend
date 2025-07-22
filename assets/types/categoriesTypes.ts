enum CategoryTypeEnum {
  LANGUAGE = 'language',
  SCIENCE = 'science',
}

export interface CategoryType {
  id: string
  type: CategoryTypeEnum
}
