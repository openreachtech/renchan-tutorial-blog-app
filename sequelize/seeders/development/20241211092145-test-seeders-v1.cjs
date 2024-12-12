'use strict'

const TimestampSeedsSupplier = require('@openreachtech/renchan-sequelize/lib/tools/TimestampSeedsSupplier.cjs')

const admins = [
  { id: 50001, registered_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50002, registered_at: new Date('2024-01-02T10:00:00Z') },
  { id: 50003, registered_at: new Date('2024-01-03T12:30:00Z') },
  { id: 50004, registered_at: new Date('2024-02-01T09:15:00Z') },
  { id: 50005, registered_at: new Date('2024-02-15T14:20:00Z') },
  { id: 50006, registered_at: new Date('2024-03-01T08:00:00Z') },
  { id: 50007, registered_at: new Date('2024-03-15T16:45:00Z') },
  { id: 50008, registered_at: new Date('2024-03-31T23:59:59Z') },
  { id: 50009, registered_at: new Date('2024-04-01T00:00:01Z') },
  { id: 50010, registered_at: new Date('2024-04-10T12:00:00Z') },
]

const adminUsernames = [
  { id: 50001, admin_id: 50001, username: 'admin_super', saved_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50002, admin_id: 50002, username: 'admin_content', saved_at: new Date('2024-01-02T10:00:00Z') },
  { id: 50003, admin_id: 50003, username: 'admin_viewer', saved_at: new Date('2024-01-03T12:30:00Z') },
  { id: 50004, admin_id: 50004, username: 'admin_backup', saved_at: new Date('2024-02-01T09:15:00Z') },
  { id: 50005, admin_id: 50005, username: 'admin_test', saved_at: new Date('2024-02-15T14:20:00Z') },
  { id: 50006, admin_id: 50006, username: 'admin_temp', saved_at: new Date('2024-03-01T08:00:00Z') },
  { id: 50007, admin_id: 50007, username: 'admin_new', saved_at: new Date('2024-03-15T16:45:00Z') },
  { id: 50008, admin_id: 50008, username: 'admin_end', saved_at: new Date('2024-03-31T23:59:59Z') },
  { id: 50009, admin_id: 50009, username: 'admin_start', saved_at: new Date('2024-04-01T00:00:01Z') },
  { id: 50010, admin_id: 50010, username: 'admin_regular', saved_at: new Date('2024-04-10T12:00:00Z') },
]

const adminSecrets = [
  { id: 50001, admin_id: 50001, email: 'super.admin@example.com', saved_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50002, admin_id: 50002, email: 'content.admin@example.com', saved_at: new Date('2024-01-02T10:00:00Z') },
  { id: 50003, admin_id: 50003, email: 'viewer.admin@example.com', saved_at: new Date('2024-01-03T12:30:00Z') },
  { id: 50004, admin_id: 50004, email: 'backup.admin@example.com', saved_at: new Date('2024-02-01T09:15:00Z') },
  { id: 50005, admin_id: 50005, email: 'test.admin@example.com', saved_at: new Date('2024-02-15T14:20:00Z') },
  { id: 50006, admin_id: 50006, email: 'temp.admin@example.com', saved_at: new Date('2024-03-01T08:00:00Z') },
  { id: 50007, admin_id: 50007, email: 'new.admin@example.com', saved_at: new Date('2024-03-15T16:45:00Z') },
  { id: 50008, admin_id: 50008, email: 'end.admin@example.com', saved_at: new Date('2024-03-31T23:59:59Z') },
  { id: 50009, admin_id: 50009, email: 'start.admin@example.com', saved_at: new Date('2024-04-01T00:00:01Z') },
  { id: 50010, admin_id: 50010, email: 'regular.admin@example.com', saved_at: new Date('2024-04-10T12:00:00Z') },
]

const adminAccessTokens = [
  { id: 50001, admin_id: 50001, token: 'token_super_valid', generated_at: new Date('2024-04-01T00:00:00Z'), expired_at: new Date('2024-05-01T00:00:00Z') },
  { id: 50002, admin_id: 50002, token: 'token_content_valid', generated_at: new Date('2024-04-05T00:00:00Z'), expired_at: new Date('2024-05-05T00:00:00Z') },
  { id: 50003, admin_id: 50003, token: 'token_viewer_valid', generated_at: new Date('2024-04-08T00:00:00Z'), expired_at: new Date('2024-05-08T00:00:00Z') },
  { id: 50004, admin_id: 50004, token: 'token_backup_expired', generated_at: new Date('2024-03-01T00:00:00Z'), expired_at: new Date('2024-04-01T00:00:00Z') },
  { id: 50005, admin_id: 50005, token: 'token_test_nearexpiry', generated_at: new Date('2024-04-09T00:00:00Z'), expired_at: new Date('2024-04-11T00:00:00Z') },
]

const articleStatuses = [
  { id: 50001, name: 'published', description: 'Article is live and visible to public', saved_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50002, name: 'draft', description: 'Article is in draft state', saved_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50003, name: 'pending_review', description: 'Article is awaiting editorial review', saved_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50004, name: 'scheduled', description: 'Article is scheduled for future publication', saved_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50005, name: 'archived', description: 'Article has been archived', saved_at: new Date('2024-01-01T00:00:00Z') },
]

const articles = [
  {
    id: 50001,
    title: 'Breaking News Article',
    content: `# Major Discovery in Tech Industry

A breakthrough in quantum computing has been announced today. Scientists have achieved stable quantum entanglement at room temperature.

## Key Points
- 99.9% success rate
- Room temperature operation
- Commercial applications expected`,
    posted_at: new Date('2024-04-01T10:00:00Z'),
    saved_at: new Date('2024-04-01T10:00:00Z'),
  },
  {
    id: 50002,
    title: 'Tech Review',
    content: `# NextGen Pro Review

Quick review of the latest smartphone.

## Specs
- 6.7" display
- 12GB RAM
- 256GB storage

**Verdict**: 4/5 stars`,
    posted_at: new Date('2024-04-02T11:30:00Z'),
    saved_at: new Date('2024-04-02T11:30:00Z'),
  },
  {
    id: 50003,
    title: 'Draft Article',
    content: `# Sustainable Architecture [DRAFT]

[Note: Draft version]

## Trends
1. Smart buildings
2. Green materials
3. Energy efficiency

[TODO: Add examples]`,
    posted_at: new Date('2024-04-02T09:20:00Z'),
    saved_at: new Date('2024-04-03T09:00:00Z'),
  },
  {
    id: 50004,
    title: 'Scheduled Post',
    content: `# Upcoming Tech Festival

Join us for the Spring Tech Festival 2024!

## Details
- Date: April 20-22
- Venue: Convention Center
- Topics: AI, IoT, Green Tech`,
    posted_at: new Date('2024-04-15T00:00:00Z'),
    saved_at: new Date('2024-04-03T14:30:00Z'),
  },
  {
    id: 50005,
    title: 'Archived Article',
    content: `# 2023 Review

*Archive: January 2024*

## Highlights
- AI advancements
- Market growth
- Innovation trends`,
    posted_at: new Date('2024-01-01T00:00:00Z'),
    saved_at: new Date('2024-01-01T00:00:00Z'),
  },
  {
    id: 50006,
    title: 'Featured Story',
    content: `# Green Technology

Exploring sustainable tech innovations.

## Sectors
- Solar power
- Electric vehicles
- Smart grids

> "Innovation meets sustainability"`,
    posted_at: new Date('2024-04-03T15:45:00Z'),
    saved_at: new Date('2024-04-03T15:45:00Z'),
  },
  {
    id: 50007,
    title: 'Under Review',
    content: `# AI in Healthcare [REVIEW]

[Editor: Please verify]

## Areas
1. Diagnosis
2. Treatment
3. Research

[Pending approval]`,
    posted_at: new Date('2024-04-03T11:20:00Z'),
    saved_at: new Date('2024-04-04T11:20:00Z'),
  },
  {
    id: 50008,
    title: 'Weekly Update',
    content: `# Week in Tech

## Updates
- New product launches
- Market changes
- Industry news

*Weekly summary complete*`,
    posted_at: new Date('2024-04-08T09:00:00Z'),
    saved_at: new Date('2024-04-08T09:00:00Z'),
  },
  {
    id: 50009,
    title: 'Month in Review',
    content: `# March 2024 Recap

## Top Stories
1. AI developments
2. Market trends
3. Tech innovations`,
    posted_at: new Date('2024-03-31T23:59:59Z'),
    saved_at: new Date('2024-03-31T23:59:59Z'),
  },
  {
    id: 50010,
    title: 'Year Ahead Preview',
    content: `# 2024 Tech Preview

## Predictions
- AI expansion
- Green tech growth
- Digital transformation`,
    posted_at: new Date('2024-04-01T00:00:01Z'),
    saved_at: new Date('2024-04-01T00:00:01Z'),
  },
]

const articleLatestStatuses = [
  { id: 50001, article_id: 50001, article_status_id: 50001, saved_at: new Date('2024-04-01T10:00:00Z') },
  { id: 50002, article_id: 50002, article_status_id: 50002, saved_at: new Date('2024-04-02T11:30:00Z') },
  { id: 50003, article_id: 50003, article_status_id: 50003, saved_at: new Date('2024-04-03T09:00:00Z') },
  { id: 50004, article_id: 50004, article_status_id: 50004, saved_at: new Date('2024-04-03T14:30:00Z') },
  { id: 50005, article_id: 50005, article_status_id: 50005, saved_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50006, article_id: 50006, article_status_id: 50001, saved_at: new Date('2024-04-03T15:45:00Z') },
  { id: 50007, article_id: 50007, article_status_id: 50002, saved_at: new Date('2024-04-04T11:20:00Z') },
  { id: 50008, article_id: 50008, article_status_id: 50001, saved_at: new Date('2024-04-08T09:00:00Z') },
  { id: 50009, article_id: 50009, article_status_id: 50001, saved_at: new Date('2024-03-31T23:59:59Z') },
  { id: 50010, article_id: 50010, article_status_id: 50004, saved_at: new Date('2024-04-01T00:00:01Z') },
]

const tags = [
  { id: 50001, name: 'news', saved_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50002, name: 'technology', saved_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50003, name: 'lifestyle', saved_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50004, name: 'business', saved_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50005, name: 'history', saved_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50006, name: 'feature', saved_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50007, name: 'review', saved_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50008, name: 'update', saved_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50009, name: 'monthly', saved_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50010, name: 'preview', saved_at: new Date('2024-01-01T00:00:00Z') },
]

const articleTags = [
  { id: 50001, article_id: 50001, tag_id: 50001, saved_at: new Date('2024-04-01T10:00:00Z') },
  { id: 50002, article_id: 50001, tag_id: 50002, saved_at: new Date('2024-04-01T10:00:00Z') },
  { id: 50003, article_id: 50002, tag_id: 50002, saved_at: new Date('2024-04-02T11:30:00Z') },
  { id: 50004, article_id: 50003, tag_id: 50003, saved_at: new Date('2024-04-03T09:00:00Z') },
  { id: 50005, article_id: 50004, tag_id: 50001, saved_at: new Date('2024-04-03T14:30:00Z') },
  { id: 50006, article_id: 50004, tag_id: 50004, saved_at: new Date('2024-04-03T14:30:00Z') },
  { id: 50008, article_id: 50005, tag_id: 50005, saved_at: new Date('2024-01-01T00:00:00Z') },
  { id: 50009, article_id: 50006, tag_id: 50001, saved_at: new Date('2024-04-03T15:45:00Z') },
  { id: 50010, article_id: 50006, tag_id: 50006, saved_at: new Date('2024-04-03T15:45:00Z') },
  { id: 50011, article_id: 50007, tag_id: 50007, saved_at: new Date('2024-04-04T11:20:00Z') },
  { id: 50012, article_id: 50008, tag_id: 50008, saved_at: new Date('2024-04-08T09:00:00Z') },
  { id: 50013, article_id: 50009, tag_id: 50009, saved_at: new Date('2024-03-31T23:59:59Z') },
  { id: 50014, article_id: 50010, tag_id: 50010, saved_at: new Date('2024-04-01T00:00:01Z') },
]

const articleThumbnails = [
  { id: 50001, article_id: 50001, image_url: '/images/breaking-news-50001.jpg', saved_at: new Date('2024-04-01T10:00:00Z') },
  { id: 50002, article_id: 50002, image_url: '/images/tech-review-50002.jpg', saved_at: new Date('2024-04-02T11:30:00Z') },
  { id: 50003, article_id: 50004, image_url: '/images/scheduled-post-50004.jpg', saved_at: new Date('2024-04-03T14:30:00Z') },
  { id: 50004, article_id: 50006, image_url: '/images/featured-story-50006.jpg', saved_at: new Date('2024-04-03T15:45:00Z') },
  { id: 50005, article_id: 50007, image_url: '/images/under-review-50007.jpg', saved_at: new Date('2024-04-04T11:20:00Z') },
  { id: 50006, article_id: 50008, image_url: '/images/weekly-update-50008.jpg', saved_at: new Date('2024-04-08T09:00:00Z') },
  { id: 50007, article_id: 50009, image_url: '/images/month-review-50009.jpg', saved_at: new Date('2024-03-31T23:59:59Z') },
  { id: 50008, article_id: 50010, image_url: '/images/year-preview-50010.jpg', saved_at: new Date('2024-04-01T00:00:01Z') },
]

const TABLE_NAME_ADMINS = 'admins'
const TABLE_NAME_ADMIN_USERNAMES = 'admin_usernames'
const TABLE_NAME_ADMIN_SECRETS = 'admin_secrets'
const TABLE_NAME_ADMIN_ACCESS_TOKENS = 'admin_access_tokens'
const TABLE_NAME_ARTICLE_STATUSES = 'article_statuses'
const TABLE_NAME_ARTICLES = 'articles'
const TABLE_NAME_ARTICLE_LATEST_STATUSES = 'article_latest_statuses'
const TABLE_NAME_TAGS = 'tags'
const TABLE_NAME_ARTICLE_TAGS = 'article_tags'
const TABLE_NAME_ARTICLE_THUMBNAILS = 'article_thumbnails'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(TABLE_NAME_ADMINS, TimestampSeedsSupplier.supplyAll(admins), {})
    await queryInterface.bulkInsert(TABLE_NAME_ADMIN_USERNAMES, TimestampSeedsSupplier.supplyAll(adminUsernames), {})
    await queryInterface.bulkInsert(TABLE_NAME_ADMIN_SECRETS, TimestampSeedsSupplier.supplyAll(adminSecrets), {})
    await queryInterface.bulkInsert(TABLE_NAME_ADMIN_ACCESS_TOKENS, TimestampSeedsSupplier.supplyAll(adminAccessTokens), {})
    await queryInterface.bulkInsert(TABLE_NAME_ARTICLE_STATUSES, TimestampSeedsSupplier.supplyAll(articleStatuses), {})
    await queryInterface.bulkInsert(TABLE_NAME_ARTICLES, TimestampSeedsSupplier.supplyAll(articles), {})
    await queryInterface.bulkInsert(TABLE_NAME_ARTICLE_LATEST_STATUSES, TimestampSeedsSupplier.supplyAll(articleLatestStatuses), {})
    await queryInterface.bulkInsert(TABLE_NAME_TAGS, TimestampSeedsSupplier.supplyAll(tags), {})
    await queryInterface.bulkInsert(TABLE_NAME_ARTICLE_TAGS, TimestampSeedsSupplier.supplyAll(articleTags), {})
    await queryInterface.bulkInsert(TABLE_NAME_ARTICLE_THUMBNAILS, TimestampSeedsSupplier.supplyAll(articleThumbnails), {})
  },

  down: async (queryInterface, Sequelize) => {
    const adminIds = admins.map(admin => admin.id)
    const adminUsernameIds = adminUsernames.map(username => username.id)
    const adminSecretIds = adminSecrets.map(secret => secret.id)
    const adminAccessTokenIds = adminAccessTokens.map(token => token.id)
    const articleStatusIds = articleStatuses.map(status => status.id)
    const articleIds = articles.map(article => article.id)
    const articleLatestStatusIds = articleLatestStatuses.map(status => status.id)
    const tagIds = tags.map(tag => tag.id)
    const articleTagIds = articleTags.map(articleTag => articleTag.id)
    const articleThumbnailIds = articleThumbnails.map(thumbnail => thumbnail.id)

    await queryInterface.bulkDelete(TABLE_NAME_ARTICLE_THUMBNAILS, { id: articleThumbnailIds }, {})
    await queryInterface.bulkDelete(TABLE_NAME_ARTICLE_TAGS, { id: articleTagIds }, {})
    await queryInterface.bulkDelete(TABLE_NAME_TAGS, { id: tagIds }, {})
    await queryInterface.bulkDelete(TABLE_NAME_ARTICLE_LATEST_STATUSES, { id: articleLatestStatusIds }, {})
    await queryInterface.bulkDelete(TABLE_NAME_ARTICLES, { id: articleIds }, {})
    await queryInterface.bulkDelete(TABLE_NAME_ARTICLE_STATUSES, { id: articleStatusIds }, {})
    await queryInterface.bulkDelete(TABLE_NAME_ADMIN_ACCESS_TOKENS, { id: adminAccessTokenIds }, {})
    await queryInterface.bulkDelete(TABLE_NAME_ADMIN_SECRETS, { id: adminSecretIds }, {})
    await queryInterface.bulkDelete(TABLE_NAME_ADMIN_USERNAMES, { id: adminUsernameIds }, {})
    await queryInterface.bulkDelete(TABLE_NAME_ADMINS, { id: adminIds }, {})
  },
}
