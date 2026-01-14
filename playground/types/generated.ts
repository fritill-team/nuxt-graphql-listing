import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  NullableDateTime: { input: any; output: any; }
  NullableDecimal: { input: any; output: any; }
};

export type CategoryCountGql = {
  __typename?: 'CategoryCountGQL';
  categoryId: Scalars['ID']['output'];
  count: Scalars['Int']['output'];
  pathText: Maybe<Scalars['String']['output']>;
  translations: Maybe<Array<CategoryTranslationGql>>;
  treeId: Scalars['ID']['output'];
};

export type CategoryGql = {
  __typename?: 'CategoryGQL';
  categoryId: Scalars['ID']['output'];
  pathText: Maybe<Scalars['String']['output']>;
  translations: Maybe<Array<CategoryTranslationGql>>;
  treeId: Scalars['ID']['output'];
};

export type CategoryTranslationGql = {
  __typename?: 'CategoryTranslationGQL';
  language: Scalars['String']['output'];
  name: Maybe<Scalars['String']['output']>;
  slug: Maybe<Scalars['String']['output']>;
};

export type ChapterGql = {
  __typename?: 'ChapterGQL';
  courseId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  durationFormatted: Scalars['String']['output'];
  durationSeconds: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  numberOfLessons: Scalars['Int']['output'];
  order: Scalars['Int']['output'];
  translations: Maybe<Array<ChapterTranslationGql>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ChapterTranslationGql = {
  __typename?: 'ChapterTranslationGQL';
  description: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  language: Scalars['String']['output'];
  title: Maybe<Scalars['String']['output']>;
};

export type CourseAssetGql = {
  __typename?: 'CourseAssetGQL';
  assetId: Scalars['String']['output'];
  assetType: CourseAssetTypeEnum;
};

export type CourseAssetTypeEnum =
  | 'COVER'
  | 'PROMOTIONAL'
  | 'THUMBNAIL';

export type CourseFacetsGql = {
  __typename?: 'CourseFacetsGQL';
  categories: Array<CategoryCountGql>;
  priceMaxCents: Maybe<Scalars['Int']['output']>;
  priceMinCents: Maybe<Scalars['Int']['output']>;
  statusCounts: Array<StatusCountGql>;
};

export type CourseFilterInput = {
  categoryId: InputMaybe<Scalars['ID']['input']>;
  categoryIdIn: InputMaybe<Array<Scalars['ID']['input']>>;
  categoryIdNotIn: InputMaybe<Array<Scalars['ID']['input']>>;
  categorySlug: InputMaybe<Scalars['String']['input']>;
  categorySlugIn: InputMaybe<Array<Scalars['String']['input']>>;
  categorySlugNotIn: InputMaybe<Array<Scalars['String']['input']>>;
  createdAt: InputMaybe<DateTimeRangeFilterInput>;
  deletedAt: InputMaybe<DateTimeRangeFilterInput>;
  durationSeconds: InputMaybe<IntRangeFilterInput>;
  hasChapters: InputMaybe<Scalars['Boolean']['input']>;
  hasDiscount: InputMaybe<Scalars['Boolean']['input']>;
  hasLessons: InputMaybe<Scalars['Boolean']['input']>;
  id: InputMaybe<Scalars['ID']['input']>;
  idIn: InputMaybe<Array<Scalars['ID']['input']>>;
  idNotIn: InputMaybe<Array<Scalars['ID']['input']>>;
  isDeleted: InputMaybe<Scalars['Boolean']['input']>;
  isFeature: InputMaybe<Scalars['Boolean']['input']>;
  isFree: InputMaybe<Scalars['Boolean']['input']>;
  isLive: InputMaybe<Scalars['Boolean']['input']>;
  isPublished: InputMaybe<Scalars['Boolean']['input']>;
  language: InputMaybe<Scalars['String']['input']>;
  numberOfChapters: InputMaybe<IntRangeFilterInput>;
  numberOfLessons: InputMaybe<IntRangeFilterInput>;
  price: InputMaybe<DecimalRangeFilterInput>;
  publishedAt: InputMaybe<DateTimeRangeFilterInput>;
  rating: InputMaybe<IntRangeFilterInput>;
  slug: InputMaybe<Scalars['String']['input']>;
  slugIn: InputMaybe<Array<Scalars['String']['input']>>;
  slugNotIn: InputMaybe<Array<Scalars['String']['input']>>;
  status: InputMaybe<CourseStatusEnum>;
  statusIn: InputMaybe<Array<CourseStatusEnum>>;
  statusNotIn: InputMaybe<Array<CourseStatusEnum>>;
  updatedAt: InputMaybe<DateTimeRangeFilterInput>;
};

export type CourseGql = {
  __typename?: 'CourseGQL';
  assets: Maybe<Array<CourseAssetGql>>;
  category: Maybe<CategoryGql>;
  categoryId: Maybe<Scalars['ID']['output']>;
  chapters: Maybe<Array<ChapterGql>>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt: Maybe<Scalars['DateTime']['output']>;
  durationSeconds: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isFeature: Scalars['Boolean']['output'];
  isLive: Scalars['Boolean']['output'];
  lessons: Maybe<Array<LessonGql>>;
  numberOfChapters: Scalars['Int']['output'];
  numberOfLessons: Scalars['Int']['output'];
  prices: Maybe<Array<PriceGql>>;
  publishedAt: Maybe<Scalars['DateTime']['output']>;
  rating: Maybe<Scalars['Int']['output']>;
  reviewsCount: Maybe<Scalars['Int']['output']>;
  status: CourseStatusEnum;
  translations: Maybe<Array<CourseTranslationGql>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type CourseListInput = {
  filter: InputMaybe<CourseFilterInput>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  sort: InputMaybe<CourseSortInput>;
};

export type CourseResultsGql = {
  __typename?: 'CourseResultsGQL';
  facets: Maybe<CourseFacetsGql>;
  items: Array<CourseGql>;
  total: Scalars['Int']['output'];
};

export type CourseSortInput = {
  createdAt: InputMaybe<SortDirection>;
  /** Sort by the minimum price (amount_cents) available for a course. */
  price: InputMaybe<SortDirection>;
  publishedAt: InputMaybe<SortDirection>;
  /** Sort by the average course rating. */
  rating: InputMaybe<SortDirection>;
  /** Sort by translated title, falls back to any translation when no language filter provided. */
  title: InputMaybe<SortDirection>;
  updatedAt: InputMaybe<SortDirection>;
};

export type CourseStatusEnum =
  | 'ARCHIVED'
  | 'CANCELED'
  | 'ENDED'
  | 'PENDING'
  | 'PUBLISHED'
  | 'STARTED'
  | 'SUSPENDED';

export type CourseTranslationGql = {
  __typename?: 'CourseTranslationGQL';
  description: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  /** Language code (e.g., 'en', 'ar') */
  language: Scalars['String']['output'];
  metadata: Maybe<Scalars['JSON']['output']>;
  slug: Maybe<Scalars['String']['output']>;
  title: Maybe<Scalars['String']['output']>;
};

export type DateTimeRangeFilterInput = {
  eq: InputMaybe<Scalars['NullableDateTime']['input']>;
  gt: InputMaybe<Scalars['NullableDateTime']['input']>;
  gte: InputMaybe<Scalars['NullableDateTime']['input']>;
  lt: InputMaybe<Scalars['NullableDateTime']['input']>;
  lte: InputMaybe<Scalars['NullableDateTime']['input']>;
};

export type DecimalRangeFilterInput = {
  eq: InputMaybe<Scalars['NullableDecimal']['input']>;
  gt: InputMaybe<Scalars['NullableDecimal']['input']>;
  gte: InputMaybe<Scalars['NullableDecimal']['input']>;
  lt: InputMaybe<Scalars['NullableDecimal']['input']>;
  lte: InputMaybe<Scalars['NullableDecimal']['input']>;
};

export type IntRangeFilterInput = {
  eq: InputMaybe<Scalars['Int']['input']>;
  gt: InputMaybe<Scalars['Int']['input']>;
  gte: InputMaybe<Scalars['Int']['input']>;
  lt: InputMaybe<Scalars['Int']['input']>;
  lte: InputMaybe<Scalars['Int']['input']>;
};

export type LessonAssetGql = {
  __typename?: 'LessonAssetGQL';
  assetId: Scalars['String']['output'];
  assetType: LessonAssetTypeEnum;
};

export type LessonAssetTypeEnum =
  | 'AUDIO'
  | 'COVER'
  | 'IMAGE'
  | 'OTHER'
  | 'PDF'
  | 'THUMBNAIL'
  | 'VIDEO';

export type LessonGql = {
  __typename?: 'LessonGQL';
  assets: Maybe<Array<LessonAssetGql>>;
  chapterId: Maybe<Scalars['ID']['output']>;
  courseId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  durationFormatted: Scalars['String']['output'];
  durationSeconds: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isFree: Scalars['Boolean']['output'];
  orderInChapter: Maybe<Scalars['Int']['output']>;
  orderInCourse: Maybe<Scalars['Int']['output']>;
  translations: Maybe<Array<LessonTranslationGql>>;
  type: LessonTypeEnum;
  updatedAt: Scalars['DateTime']['output'];
};

export type LessonTranslationGql = {
  __typename?: 'LessonTranslationGQL';
  description: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  language: Scalars['String']['output'];
  title: Maybe<Scalars['String']['output']>;
};

export type LessonTypeEnum =
  | 'article'
  | 'live'
  | 'quiz'
  | 'video';

export type PriceGql = {
  __typename?: 'PriceGQL';
  /** Amount in major currency units (e.g., egyptian pounds) */
  amount: Scalars['Float']['output'];
  /** Amount in cents (original price) */
  amountCents: Scalars['Int']['output'];
  compareAtAmountCents: Maybe<Scalars['Int']['output']>;
  /** Compare at price in major currency units (e.g., egyptian pounds) */
  compareAtPrice: Scalars['Float']['output'];
  /** Currency code (e.g., 'USD', 'SAR') */
  currency: Scalars['String']['output'];
  discountPercentage: Maybe<Scalars['Int']['output']>;
  /** Discounted price */
  discountedPrice: Scalars['Float']['output'];
  /** Display price in major currency units (e.g., egyptian pounds) */
  displayPrice: Scalars['Float']['output'];
  hasDiscount: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isFree: Scalars['Boolean']['output'];
  /** Saving amount in major currency units (e.g., egyptian pounds) */
  savingAmount: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  courses: CourseResultsGql;
};


export type QueryCoursesArgs = {
  coursesInput?: InputMaybe<CourseListInput>;
};

export type SortDirection =
  | 'ASC'
  | 'DESC';

export type StatusCountGql = {
  __typename?: 'StatusCountGQL';
  count: Scalars['Int']['output'];
  status: CourseStatusEnum;
};

export type CourseDetailsQueryVariables = Exact<{
  input: CourseListInput;
}>;


export type CourseDetailsQuery = { __typename?: 'Query', courses: { __typename?: 'CourseResultsGQL', items: Array<{ __typename?: 'CourseGQL', id: string, rating: number | null, reviewsCount: number | null, isLive: boolean, numberOfChapters: number, numberOfLessons: number, durationSeconds: number, prices: Array<{ __typename?: 'PriceGQL', compareAtAmountCents: number | null, discountPercentage: number | null, hasDiscount: boolean, id: string, amount: number, amountCents: number, currency: string, discountedPrice: number, displayPrice: number, isFree: boolean, compareAtPrice: number, savingAmount: number }> | null, chapters: Array<{ __typename?: 'ChapterGQL', id: string, durationFormatted: string, durationSeconds: number, numberOfLessons: number, order: number, translations: Array<{ __typename?: 'ChapterTranslationGQL', description: any | null, id: string, title: string | null, language: string }> | null }> | null, lessons: Array<{ __typename?: 'LessonGQL', durationFormatted: string, durationSeconds: number, id: string, orderInCourse: number | null, orderInChapter: number | null, type: LessonTypeEnum, chapterId: string | null, translations: Array<{ __typename?: 'LessonTranslationGQL', description: any | null, id: string, language: string, title: string | null }> | null, assets: Array<{ __typename?: 'LessonAssetGQL', assetId: string, assetType: LessonAssetTypeEnum }> | null }> | null, translations: Array<{ __typename?: 'CourseTranslationGQL', slug: string | null, title: string | null, language: string, description: any | null, id: string, metadata: any | null }> | null, category: { __typename?: 'CategoryGQL', categoryId: string, pathText: string | null, treeId: string, translations: Array<{ __typename?: 'CategoryTranslationGQL', language: string, name: string | null, slug: string | null }> | null } | null, assets: Array<{ __typename?: 'CourseAssetGQL', assetId: string, assetType: CourseAssetTypeEnum }> | null }> } };

export type CoursesQueryVariables = Exact<{
  input: CourseListInput;
}>;


export type CoursesQuery = { __typename?: 'Query', courses: { __typename?: 'CourseResultsGQL', total: number, items: Array<{ __typename?: 'CourseGQL', id: string, rating: number | null, reviewsCount: number | null, isLive: boolean, numberOfLessons: number, durationSeconds: number, prices: Array<{ __typename?: 'PriceGQL', compareAtAmountCents: number | null, discountPercentage: number | null, hasDiscount: boolean, id: string, amount: number, amountCents: number, currency: string, discountedPrice: number, displayPrice: number, isFree: boolean, compareAtPrice: number, savingAmount: number }> | null, translations: Array<{ __typename?: 'CourseTranslationGQL', slug: string | null, title: string | null, language: string, description: any | null, id: string, metadata: any | null }> | null, category: { __typename?: 'CategoryGQL', categoryId: string, pathText: string | null, treeId: string, translations: Array<{ __typename?: 'CategoryTranslationGQL', language: string, name: string | null, slug: string | null }> | null } | null, assets: Array<{ __typename?: 'CourseAssetGQL', assetId: string, assetType: CourseAssetTypeEnum }> | null }>, facets: { __typename?: 'CourseFacetsGQL', priceMaxCents: number | null, priceMinCents: number | null, categories: Array<{ __typename?: 'CategoryCountGQL', count: number, categoryId: string, pathText: string | null, treeId: string, translations: Array<{ __typename?: 'CategoryTranslationGQL', language: string, name: string | null, slug: string | null }> | null }> } | null } };


export const CourseDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourseDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CourseListInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"coursesInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"reviewsCount"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfChapters"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfLessons"}},{"kind":"Field","name":{"kind":"Name","value":"durationSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"compareAtAmountCents"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"hasDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountCents"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"discountedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"displayPrice"}},{"kind":"Field","name":{"kind":"Name","value":"isFree"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"savingAmount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chapters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"durationFormatted"}},{"kind":"Field","name":{"kind":"Name","value":"durationSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfLessons"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"durationFormatted"}},{"kind":"Field","name":{"kind":"Name","value":"durationSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderInCourse"}},{"kind":"Field","name":{"kind":"Name","value":"orderInChapter"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assetId"}},{"kind":"Field","name":{"kind":"Name","value":"assetType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chapterId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"pathText"}},{"kind":"Field","name":{"kind":"Name","value":"treeId"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assetId"}},{"kind":"Field","name":{"kind":"Name","value":"assetType"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CourseDetailsQuery, CourseDetailsQueryVariables>;
export const CoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Courses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CourseListInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"coursesInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"reviewsCount"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfLessons"}},{"kind":"Field","name":{"kind":"Name","value":"durationSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"compareAtAmountCents"}},{"kind":"Field","name":{"kind":"Name","value":"discountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"hasDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountCents"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"discountedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"displayPrice"}},{"kind":"Field","name":{"kind":"Name","value":"isFree"}},{"kind":"Field","name":{"kind":"Name","value":"compareAtPrice"}},{"kind":"Field","name":{"kind":"Name","value":"savingAmount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"pathText"}},{"kind":"Field","name":{"kind":"Name","value":"treeId"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assetId"}},{"kind":"Field","name":{"kind":"Name","value":"assetType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"facets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"pathText"}},{"kind":"Field","name":{"kind":"Name","value":"treeId"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceMaxCents"}},{"kind":"Field","name":{"kind":"Name","value":"priceMinCents"}}]}}]}}]}}]} as unknown as DocumentNode<CoursesQuery, CoursesQueryVariables>;