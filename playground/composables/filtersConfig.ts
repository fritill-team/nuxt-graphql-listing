import type {CourseFilterInput, SortDirection} from '~/types/generated'
import type {FilterFieldConfig, SortOption} from '../../src/runtime/types/listing'
import type {CourseSort} from '~/types/listing'


export const useCourseFilterConfig = (): FilterFieldConfig<keyof CourseFilterInput>[] => {
  return [
    {
      key: 'meta-switches',
      kind: 'switch-group',
      label: "",
      switches: [
        {field: 'isLive', label: "isLive"},
        {field: 'isFree', label: "isFree"},
        {field: 'hasDiscount', label: "hasDiscount"},
      ],
    },
    {kind: "separator", key: "rating-separator", label: ''},
    {
      key: "rating",
      kind: "rating",
      field: "rating",
      label: "Rating",
    },
    {kind: "separator", key: "category-separator-select", label: ''},
    {
      key: 'category',
      field: 'categoryId',
      kind: 'select',
      label: 'Category',
      options: [
        {label: 'All Categories', value: null},
        {label: 'Electronics', value: 'electronics'},
        {label: 'Clothing', value: 'clothing'},
        {label: 'Home & Garden', value: 'home-garden'}
      ]
    },
    {kind: 'separator', key: 'dates-sep', label: "By Price"},
    {
      key: 'price',
      field: 'price',
      label: "",
      kind: 'decimal-range',
    },
  ]
}


export type CourseSortField =
  | 'publishedAt'
  | 'price'
  | 'rating'

export const useCourseSortConfig = (): SortOption<CourseSortField>[] => {
  return [
    {label: 'Newest first', field: 'publishedAt', direction: 'DESC'},
    {label: 'Oldest first', field: 'publishedAt', direction: 'ASC'},
    {label: 'Price: high to low', field: 'price', direction: 'DESC'},
    {label: 'Price: low to high', field: 'price', direction: 'ASC'},
    {label: 'Rating: high to low', field: 'rating', direction: 'DESC'},
    {label: 'Rating: low to high', field: 'rating', direction: 'ASC'},
  ]
}
export const defaultCourseSort: CourseSort = [
  {field: 'publishedAt', direction: 'DESC' as SortDirection},
]
