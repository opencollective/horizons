import React, { Fragment } from 'react';
import { useRouter } from 'next/router';
import AnimateHeight from 'react-animate-height';

import getFilterOptions from '../lib/location/getFilterOptions';

import CategoryFilter from './CategorySelect';
import Dropdown from './Dropdown';
import { LocationPin } from './LocationTag';

const DateIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.42449 7.54688C9.42449 7.24484 9.66932 7 9.97136 7H10.5C10.802 7 11.0469 7.24484 11.0469 7.54688C11.0469 7.84891 10.802 8.09375 10.5 8.09375H9.97136C9.66932 8.09375 9.42449 7.84891 9.42449 7.54688ZM14 4.36086V9.68879C14 10.5284 13.673 11.3178 13.0793 11.9115L11.9115 13.0793C11.3178 13.673 10.5284 14 9.68879 14H3.28535C2.40778 14 1.58277 13.6583 0.962254 13.0377C0.341742 12.4172 0 11.5922 0 10.7146V4.36086C0 2.56421 1.43853 1.10718 3.22656 1.07603V0.546875C3.22656 0.244836 3.4714 0 3.77344 0C4.07548 0 4.32031 0.244836 4.32031 0.546875V1.07551H9.67969V0.546875C9.67969 0.244836 9.92452 0 10.2266 0C10.5286 0 10.7734 0.244836 10.7734 0.546875V1.07603C12.5623 1.10718 14 2.56514 14 4.36086ZM1.09452 4.30207H12.9055C12.8747 3.12717 11.9267 2.20021 10.7734 2.17003V2.6979C10.7734 2.99994 10.5286 3.24477 10.2265 3.24477C9.9245 3.24477 9.67966 2.99994 9.67966 2.6979V2.16926H4.32031V2.6979C4.32031 2.99994 4.07548 3.24477 3.77344 3.24477C3.4714 3.24477 3.22656 2.99994 3.22656 2.6979V2.17003C2.05152 2.20082 1.1247 3.14896 1.09452 4.30207ZM12.8329 10.2357H11.3294C10.7263 10.2357 10.2357 10.7263 10.2357 11.3294V12.8329C10.5737 12.7399 10.8835 12.5605 11.1381 12.3059L12.3059 11.1381C12.5605 10.8835 12.7399 10.5737 12.8329 10.2357ZM12.9062 5.39582H1.09375V10.7146C1.09375 11.3001 1.32171 11.8504 1.73567 12.2644C2.1496 12.6783 2.69995 12.9062 3.28535 12.9062H9.14192V11.3294C9.14192 10.1232 10.1232 9.14192 11.3294 9.14192H12.9062V5.39582ZM3.5 10.7917H4.02864C4.33068 10.7917 4.57551 10.5468 4.57551 10.2448C4.57551 9.94276 4.33068 9.69793 4.02864 9.69793H3.5C3.19796 9.69793 2.95312 9.94276 2.95312 10.2448C2.95312 10.5468 3.19796 10.7917 3.5 10.7917ZM6.73567 8.09375H7.2643C7.56634 8.09375 7.81118 7.84891 7.81118 7.54688C7.81118 7.24484 7.56634 7 7.2643 7H6.73567C6.43363 7 6.18879 7.24484 6.18879 7.54688C6.18879 7.84891 6.43366 8.09375 6.73567 8.09375ZM3.5 8.09375H4.02864C4.33068 8.09375 4.57551 7.84891 4.57551 7.54688C4.57551 7.24484 4.33068 7 4.02864 7H3.5C3.19796 7 2.95312 7.24484 2.95312 7.54688C2.95312 7.84891 3.19796 8.09375 3.5 8.09375ZM6.73567 10.7917H7.2643C7.56634 10.7917 7.81118 10.5468 7.81118 10.2448C7.81118 9.94276 7.56634 9.69793 7.2643 9.69793H6.73567C6.43363 9.69793 6.18879 9.94276 6.18879 10.2448C6.18879 10.5468 6.43366 10.7917 6.73567 10.7917Z"
      fill="#75777A"
    />
  </svg>
);

const FilterIcon = () => (
  <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.125 10C10.7466 10 11.25 10.4475 11.25 11C11.25 11.5525 10.7466 12 10.125 12H7.875C7.25344 12 6.75 11.5525 6.75 11C6.75 10.4475 7.25344 10 7.875 10H10.125ZM13.5 5C14.1216 5 14.625 5.4475 14.625 6C14.625 6.5525 14.1216 7 13.5 7H4.5C3.87844 7 3.375 6.5525 3.375 6C3.375 5.4475 3.87844 5 4.5 5H13.5ZM16.875 0C17.4966 0 18 0.447504 18 1C18 1.5525 17.4966 2 16.875 2H1.125C0.503442 2 0 1.5525 0 1C0 0.447504 0.503442 0 1.125 0H16.875Z"
      fill="#4D4F51"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.21175 1.43745L1.31632 1.31632C1.69975 0.932901 2.29974 0.898044 2.72254 1.21175L2.84368 1.31632L10 8.47216L17.1563 1.31632C17.5397 0.932901 18.1397 0.898044 18.5625 1.21175L18.6837 1.31632C19.0671 1.69975 19.102 2.29974 18.7882 2.72254L18.6837 2.84368L11.5278 10L18.6837 17.1563C19.0671 17.5397 19.102 18.1397 18.7882 18.5625L18.6837 18.6837C18.3003 19.0671 17.7003 19.102 17.2775 18.7882L17.1563 18.6837L10 11.5278L2.84368 18.6837C2.46025 19.0671 1.86026 19.102 1.43745 18.7882L1.31632 18.6837C0.932901 18.3003 0.898044 17.7003 1.21175 17.2775L1.31632 17.1563L8.47216 10L1.31632 2.84368C0.932901 2.46025 0.898044 1.86026 1.21175 1.43745L1.31632 1.31632L1.21175 1.43745Z"
      fill="#4D4F51"
    />
  </svg>
);

// function that removes slug from query object
const removeSlug = query => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { slug: _, ...rest } = query;
  return rest;
};

export const Filters = ({
  currentTimePeriod,
  currentTag,
  categories,
  collectives,
  currentLocationFilter,
  setCurrentLocationFilter,
  hideLocationAndTimeFilters,
  collapseFilterArea,
}) => {
  const router = useRouter();
  const locationOptions = React.useMemo(() => getFilterOptions(collectives.map(c => ({ values: c }))), [collectives]);
  return (
    <div className="relative z-50 translate-x-0 bg-white">
      <CategoryFilter
        currentTimePeriod={currentTimePeriod}
        selectedTag={currentTag}
        categories={categories}
        onSelect={category => {
          collapseFilterArea?.();
          router.push(
            { pathname: '/foundation', query: { ...removeSlug(router.query), ...{ tag: category.tag } } },
            null,
            {
              shallow: true,
            },
          );
        }}
      />
      <AnimateHeight id="example-panel" duration={500} height={hideLocationAndTimeFilters ? 0 : 'auto'}>
        <div className="mt-4 border-t pt-4">
          <div className="space-y-2">
            <Dropdown
              fieldLabel={
                <div className="flex items-center gap-2 whitespace-nowrap text-sm font-medium">
                  <DateIcon />
                  <span className="text-gray-900">Date range</span>
                </div>
              }
              options={[
                { value: 'ALL', label: 'All time' },
                { value: 'PAST_YEAR', label: 'Past 12 months' },
                { value: 'PAST_QUARTER', label: 'Past 3 months' },
              ]}
              value={currentTimePeriod}
              onChange={option => {
                collapseFilterArea?.();
                router.push(
                  { pathname: '/foundation', query: { ...removeSlug(router.query), ...{ time: option.value } } },
                  null,
                  {
                    shallow: true,
                  },
                );
              }}
            />
            <Dropdown
              fieldLabel={
                <div className="flex items-center gap-2 whitespace-nowrap text-sm font-medium">
                  <LocationPin />
                  <span className="text-gray-900">Location</span>
                </div>
              }
              options={[{ value: '', label: 'All locations' }, ...locationOptions]}
              value={JSON.parse(currentLocationFilter).value}
              onChange={value => {
                collapseFilterArea?.();
                setCurrentLocationFilter(JSON.stringify(value));
              }}
            />
          </div>
        </div>
      </AnimateHeight>
    </div>
  );
};

export default function FilterArea({
  currentTimePeriod,
  currentTag,
  categories,
  collectives,
  currentLocationFilter,
  setCurrentLocationFilter,
  hideFilters,
}) {
  const [filtersExpanded, setFiltersExpanded] = React.useState(false);
  return (
    <Fragment>
      <div className="hidden lg:block">
        <div className="rounded-lg bg-white p-4">
          <Filters
            currentTimePeriod={currentTimePeriod}
            currentTag={currentTag}
            categories={categories}
            collectives={collectives}
            currentLocationFilter={currentLocationFilter}
            setCurrentLocationFilter={setCurrentLocationFilter}
            hideLocationAndTimeFilters={hideFilters}
            collapseFilterArea={() => setFiltersExpanded(false)}
          />
        </div>
      </div>
      <div className="block lg:hidden">
        <div className="relative h-14">
          <div className="absolute top-0 right-0 left-0 rounded-2xl bg-white shadow">
            <button
              className="flex w-full  items-center justify-between rounded-2xl px-8 py-4 font-medium text-gray-800"
              onClick={() => setFiltersExpanded(!filtersExpanded)}
            >
              <span>Filters</span> {filtersExpanded ? <CloseIcon /> : <FilterIcon />}
            </button>
            {filtersExpanded && (
              <div className="p-4 pt-3">
                <Filters
                  currentTimePeriod={currentTimePeriod}
                  currentTag={currentTag}
                  categories={categories}
                  collectives={collectives}
                  currentLocationFilter={currentLocationFilter}
                  setCurrentLocationFilter={setCurrentLocationFilter}
                  hideLocationAndTimeFilters={hideFilters}
                  collapseFilterArea={() => setFiltersExpanded(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
