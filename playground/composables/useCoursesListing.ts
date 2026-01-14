import {
  type CourseFacetsGql,
  type CourseFilterInput,
  type CourseListInput,
  CoursesDocument,
  type CoursesQuery,
  type CoursesQueryVariables,
  type SortDirection
} from "~/types/generated";
import {type CourseFilters, type CourseSort, defaultCourseFilters} from "~/types/listing";


function useCoursesListing() {
  const filterConfig = useCourseFilterConfig()
  const { $courses } = useNuxtApp()

  return useListing<
    CoursesQuery['courses']['items'][number],
    CoursesQuery,
    CoursesQueryVariables,
    CourseFilters,
    CourseSort,
    CourseFacetsGql
  >({
    queryDocument: CoursesDocument,
    apolloClient: $courses,

    initialFilters: defaultCourseFilters,
    initialSort: defaultCourseSort,

    initialOffset: 0,
    initialLimit: 20,

    urlBinding: true,

    // Parse URL query params → listing state
    parseQuery: (query) => {
      return parseListingQuery<keyof CourseFilterInput, CourseFilters, CourseSort>(
        query,
        filterConfig
      )
    },

    // Build URL query params from listing state
    buildQuery: (state) => {
      return buildListingQuery<
        keyof CourseFilterInput,
        CourseFilters,
        { field: string; direction: SortDirection }
      >(
        state,
        filterConfig
      )
    },
    sortMode: 'keyed',

    buildVariables: (state) => {
      const {offset, limit, filters, sort} = state

      const input: CourseListInput = {
        filter: filters,
        sort: (sort && sort.length > 0 ? ({fields: sort} as any) : null),
        limit,
        offset,
      }

      return {input} satisfies CoursesQueryVariables
    },

    mapResult: (data) => ({
      items: data.courses.items,
      total: data.courses.total,
      facets: data.courses.facets as CourseFacetsGql,
    }),

    key: 'courses-listing',
  })
}

export default useCoursesListing
