import {
  type CourseFacetsGql,
  CoursesDocument,
  type CoursesQuery,
} from '~/types/generated'
import { type CourseFilters, type CourseSort, defaultCourseFilters } from '~/types/listing'
import type { ApolloClient } from '@apollo/client/core'
import { defaultCourseSort } from './filtersConfig'

function useCoursesListing() {
  const filterConfig = useCourseFilterConfig()
  const { $courses } = useNuxtApp() as unknown as { $courses: ApolloClient }

  return useListing<
    CoursesQuery['courses']['items'][number],
    CourseFilters,
    CourseSort,
    CourseFacetsGql
  >({
    query: CoursesDocument,
    client: $courses,
    dataPath: 'courses',
    filterKey: 'filter',
    filterConfig,
    initialFilters: defaultCourseFilters,
    initialSort: defaultCourseSort,
    initialLimit: 20,
    key: 'courses-listing',
  })
}

export default useCoursesListing
