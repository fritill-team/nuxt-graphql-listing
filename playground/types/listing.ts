import type {CourseFilterInput, SortDirection} from "~/types/generated";


export type CourseFilters = CourseFilterInput
export type SortFieldInput = {
  field: string
  direction: SortDirection
}
export type CourseSort = SortFieldInput[]

// sensible defaults
export const defaultCourseFilters: Partial<CourseFilters> = {
  status: null,
  language: null,
  isLive: null,
  price: null,
  numberOfLessons: null,
  publishedAt: null,
}

