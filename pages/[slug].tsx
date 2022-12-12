import fs from 'fs';

import React from 'react';
import { gql } from '@apollo/client';
import dayjs from 'dayjs';
import type { GetStaticProps } from 'next';
import Head from 'next/head';

import { initializeApollo } from '../lib/apollo-client';
//import { getDump } from '../lib/getDataDump';
import getLocation from '../lib/location/getLocation';
import { getAllPosts, markdownToHtml } from '../lib/markdown';

import Dashboard from '../components/Dashboard';
import Layout from '../components/Layout';

export const accountsQuery = gql`
  query SearchAccounts(
    $host: [AccountReferenceInput]
    $quarterAgo: DateTime
    $yearAgo: DateTime
    $currency: Currency
    $limit: Int
    $offset: Int
  ) {
    accounts(type: [COLLECTIVE, FUND], limit: $limit, offset: $offset, host: $host) {
      totalCount
      offset
      limit
      nodes {
        id
        name
        slug
        createdAt
        description
        imageUrl(height: 100, format: png)
        tags

        ALL_stats: stats {
          contributorsCount(includeChildren: true)
          contributionsCount(includeChildren: true)

          totalAmountSpent(includeChildren: true, currency: $currency) {
            valueInCents
            currency
          }

          totalNetAmountReceivedTimeSeries(timeUnit: YEAR, includeChildren: true, currency: $currency) {
            timeUnit
            nodes {
              date
              amount {
                valueInCents
                currency
              }
            }
          }
        }

        PAST_YEAR_stats: stats {
          contributorsCount(includeChildren: true, dateFrom: $yearAgo)
          contributionsCount(includeChildren: true, dateFrom: $yearAgo)

          totalAmountSpent(includeChildren: true, dateFrom: $yearAgo, currency: $currency) {
            valueInCents
            currency
          }
          totalNetAmountReceivedTimeSeries(
            dateFrom: $yearAgo
            timeUnit: MONTH
            includeChildren: true
            currency: $currency
          ) {
            timeUnit
            nodes {
              date
              amount {
                valueInCents
                currency
              }
            }
          }
        }

        PAST_QUARTER_stats: stats {
          contributorsCount(includeChildren: true, dateFrom: $quarterAgo)
          contributionsCount(includeChildren: true, dateFrom: $quarterAgo)

          totalAmountSpent(includeChildren: true, dateFrom: $quarterAgo, currency: $currency) {
            valueInCents
            currency
          }

          totalNetAmountReceivedTimeSeries(
            dateFrom: $quarterAgo
            timeUnit: WEEK
            includeChildren: true
            currency: $currency
          ) {
            timeUnit
            nodes {
              date
              amount {
                valueInCents
                currency
              }
            }
          }
        }
      }
    }
  }
`;

const colors = [
  { tw: 'red', color: '#EF4444' },
  { tw: 'orange', color: '#F97316' },
  { tw: 'amber', color: '#F59E0B' },
  { tw: 'yellow', color: '#EAB308' },
  { tw: 'lime', color: '#84CC16' },
  { tw: 'green', color: '#22C55E' },
  { tw: 'emerald', color: '#10B981' },
  { tw: 'teal', color: '#14B8A6' },
  { tw: 'cyan', color: '#06B6D4' },
  { tw: 'sky', color: '#0EA5E9' },
  { tw: 'blue', color: '#3B82F6' },
  { tw: 'indigo', color: '#6366F1' },
  { tw: 'violet', color: '#8B5CF6' },
  { tw: 'purple', color: '#A855F7' },
  { tw: 'fuchsia', color: '#D946EF' },
  { tw: 'pink', color: '#EC4899' },
  { tw: 'rose', color: '#F43F5E' },
];

const pickColorForCategory = (startColor: string, i: number, numOfCategories: number) => {
  const startColorIndex = colors.findIndex(c => c.tw === startColor);
  const step = Math.floor(colors.length / numOfCategories);
  return colors[(startColorIndex + i * step) % colors.length];
};

export const hosts: {
  name: string;
  slug: string;
  currency: string;
  startYear: number;
  logoSrc: string;
  color: string;
  styles: { text: string; button: string; brandBox: string; box: string };
  website?: string;
  categories?: { label: string; tag: string }[];
}[] = [
  {
    name: 'Open Collective',
    slug: '',
    currency: 'USD',
    startYear: 2016,
    logoSrc: '/oc-logo.svg',
    color: 'blue',
    styles: {
      text: 'text-[#0C2D66]',
      button: 'bg-[#0C2D66] text-white',
      brandBox: 'lg:bg-[#F5FAFF] text-[#0C2D66]',
      box: 'bg-[#F5FAFF] text-[#0C2D66]',
    },
  },
  {
    name: 'Open Collective Foundation',
    slug: 'foundation',
    currency: 'USD',
    startYear: 2018,
    logoSrc: '/ocf-logo.svg',
    color: 'teal',
    styles: {
      text: 'text-ocf-brand',
      button: 'bg-ocf-brand text-white',
      brandBox: 'lg:bg-[#F7FEFF] text-ocf-brand',
      box: 'bg-[#F7FEFF] text-ocf-brand',
    },

    categories: [
      { label: 'Mutual aid', tag: 'mutual aid' },
      { label: 'Education', tag: 'education' },
      { label: 'Civic Tech', tag: 'civic tech' },
      { label: 'Food', tag: 'food' },
      { label: 'Arts & Culture', tag: 'arts and culture' },
      {
        label: 'Climate',
        tag: 'climate',
      },
    ],
  },
  {
    name: 'Open Source Collective',
    slug: 'opensource',
    currency: 'USD',
    startYear: 2016,
    logoSrc: '/osc-logo.svg',
    website: 'https://opencollective.com/opensource',
    color: 'purple',
    styles: {
      text: 'text-[#4B3084]',
      button: 'bg-[#4B3084] text-white',
      brandBox: 'lg:bg-[#4B3084] lg:bg-opacity-5 text-[#4B3084]',
      box: 'bg-[#4B3084] bg-opacity-5 text-[#4B3084]',
    },
  },
  {
    name: 'Open Collective Europe',
    slug: 'europe',
    currency: 'EUR',
    startYear: 2019,
    logoSrc: '/oce-logo.svg',
    website: 'https://opencollective.com/europe',
    color: 'blue',
    styles: {
      text: 'text-[#0C2D66]',
      button: 'bg-[#0C2D66] text-white',
      brandBox: 'lg:bg-[#E0EC7B] lg:bg-opacity-20 text-[#0C2D66]',
      box: 'bg-[#E0EC7B] bg-opacity-20 text-[#0C2D66]',
    },
  },
];

const getTotalStats = stats => {
  const totalNetAmountReceived = stats.totalNetAmountReceivedTimeSeries.nodes.reduce(
    (acc, node) => {
      return {
        valueInCents: acc.valueInCents + node.amount.valueInCents,
        currency: node.amount.currency,
      };
    },
    { valueInCents: 0 },
  );
  const totalSpent = {
    valueInCents: Math.abs(stats.totalAmountSpent.valueInCents),
    currency: stats.totalAmountSpent.currency,
  };
  const percentDisbursed = (totalSpent.valueInCents / totalNetAmountReceived.valueInCents) * 100;

  return {
    contributors: stats.contributorsCount,
    contributions: stats.contributionsCount,
    totalSpent,
    totalNetRaised: totalNetAmountReceived,
    percentDisbursed,
    totalNetRaisedTimeSeries: stats.totalNetAmountReceivedTimeSeries.nodes,
  };
};

const getStats = collective => {
  const stats = {
    ALL: getTotalStats(collective.ALL_stats),
    PAST_YEAR: getTotalStats(collective.PAST_YEAR_stats),
    PAST_QUARTER: getTotalStats(collective.PAST_QUARTER_stats),
  };
  return stats.ALL.totalNetRaised.valueInCents !== 0 ? stats : null;
};

function graphqlRequest(client, query, variables = {}) {
  return client
    .query({
      query,
      variables,
    })
    .catch(error => {
      console.log('GraphQL: ', error.message);
      return error;
    })
    .then(result => result.data);
}

const getDataForHost = async ({ apollo, hostSlug, currency }) => {
  return { collectives: [] };
  //let data = getDump(hostSlug ?? 'ALL');
  //let nodes = [];
  // if (!data) {
  // if (!hostSlug) {
  //   return { collectives: [] };
  // }
  const variables = {
    ...(hostSlug && { host: { slug: hostSlug } }),
    quarterAgo: dayjs.utc().subtract(12, 'week').startOf('isoWeek').toISOString(),
    yearAgo: dayjs.utc().subtract(12, 'month').startOf('month').toISOString(),
    currency,
    offset: 0,
    limit: 500,
  };

  // let { data } = await apollo.query({
  //   query: accountsQuery,
  //   variables,
  // });

  let data = await graphqlRequest(apollo, accountsQuery, variables);

  if (data.accounts.totalCount > data.accounts.limit) {
    let nodes = [...data.accounts.nodes];
    do {
      variables.offset += data.accounts.limit;
      console.log(`Paginating with offset ${variables.offset}`);

      data = await graphqlRequest(apollo, accountsQuery, variables);
      nodes = [...nodes, ...data.accounts.nodes];
    } while (data.accounts.totalCount > data.accounts.limit + data.accounts.offset);

    data = {
      accounts: {
        ...data.accounts,
        offset: 0,
        limit: data.accounts.totalCount,
        nodes,
      },
    };
  }

  // eslint-disable-next-line no-process-env
  if (data && process.env.NODE_ENV === 'development') {
    fs.writeFile(`_dump/${hostSlug ?? 'ALL'}.json`, JSON.stringify(data), error => {
      if (error) {
        throw error;
      }
    });
  }

  const collectives = data.accounts.nodes.map(collective => {
    return {
      id: collective.id,
      name: collective.name,
      slug: collective.slug,
      description: collective.description,
      imageUrl: collective.imageUrl.replace('-staging', ''),
      location: getLocation(collective),
      tags: collective.tags,
      createdAt: collective.createdAt,
      stats: getStats(collective),
    };
  });

  return {
    collectives,
  };
};

const associatedTags = {
  climate: ['climate change', 'climate justice'],
  'open source': ['opensource'],
};

// function that if I have the extra tag gives me the key
const getTagKey = tag => {
  const tagKey = Object.keys(associatedTags).find(key => associatedTags[key].includes(tag));
  return tagKey || tag;
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const startTime = Date.now();
  const hostSlug: string = params ? (Array.isArray(params.slug) ? params.slug[0] : params.slug) : null;
  const host = hosts.find(h => {
    if (!hostSlug) {
      return h.slug === '';
    }
    return h.slug === hostSlug;
  });
  if (!host) {
    return {
      notFound: true,
    };
  }

  const { currency, startYear } = host;
  const apollo = initializeApollo();
  const { collectives } = await getDataForHost({ apollo, hostSlug, currency });

  const collectivesData = collectives.reduce((acc, collective) => {
    acc[collective.slug] = collective;
    return acc;
  }, {});

  let categories;
  if (!host?.categories) {
    // go through collectives and find the top tags
    const tags = collectives.reduce((acc, collective) => {
      collective.tags
        ?.filter(t => !['other', 'community', 'association', 'movement', 'USA'].includes(t))
        .forEach(tag => {
          const tagToUse = getTagKey(tag);
          if (!acc[tagToUse]) {
            acc[tagToUse] = 0;
          }
          acc[tagToUse]++;
        });
      return acc;
    }, {});

    const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
    const topTags = sortedTags.slice(0, 4);
    categories = topTags.map(tag => {
      // capitalize first letter in all words
      const label = tag
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return { label, tag, extraTags: associatedTags[tag] ?? null };
    });
  } else {
    categories = host.categories;
  }
  // add color to categories
  categories = [{ label: 'All Categories', tag: 'ALL' }, ...categories].map((category, i, arr) => {
    const { color, tw } = pickColorForCategory(host?.color ?? 'blue', i, arr.length);

    return {
      ...category,
      color,
      tw,
    };
  });

  const allStories = getAllPosts(hostSlug, ['title', 'content', 'tags', 'location', 'slug', 'video', 'collectiveSlug']);
  // run markdownToHtml on content in stories
  const storiesWithContent = await Promise.all(
    allStories.map(async story => {
      return {
        ...story,
        tags: story.tags.map(tag => ({ color: categories.find(c => c.tag === tag)?.color ?? null, tag: tag })),
        content: await markdownToHtml(story.content),
        collective: collectivesData[story.collectiveSlug] ?? null,
      };
    }),
  );

  const endTime = Date.now();
  const ms = endTime - startTime;

  return {
    props: {
      host,
      hosts,
      collectives,
      categories,
      //collectivesData,
      stories: storiesWithContent,
      startYear,
      currency,
      ms,
    },
    revalidate: 60 * 60 * 24, // Revalidate the static page at most once every 24 hours to not overload the API
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: false,
  };
}

export default function Page({ categories, stories, host, hosts, collectives, currency, startYear, ms }) {
  console.log(`Props built in ${ms} ms`);
  const locale = 'en';
  return (
    <Layout>
      <Head>
        <title>Discover {host.name}</title>
      </Head>
      <Dashboard
        categories={categories}
        collectives={collectives}
        currency={currency}
        startYear={startYear}
        stories={stories}
        locale={locale}
        host={host}
        hosts={hosts}
      />
    </Layout>
  );
}
