export default {
  MAX_ARTICLE_TITLE_LENGTH: 100,
  MINIMUM_ARTICLE_TITLE_LENGTH: 4,
  ARTICLE_STATUS: {
    DRAFT: {
      ID: 1,
      NAME: 'draft',
    },
    PUBLISHED: {
      ID: 2,
      NAME: 'published',
    },
  },
  ARTICLE_STATUS_RESOLVER: {
    1: {
      NAME: 'draft',
    },
    2: {
      NAME: 'published',
    },
  },
}
