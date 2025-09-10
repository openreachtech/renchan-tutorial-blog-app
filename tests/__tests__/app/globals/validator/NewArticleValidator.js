import NewArticleValidator from '../../../../../app/globals/validator/NewArticleValidator'
import constants from '../../../../../app/globals/constants'

const {
  MAX_ARTICLE_TITLE_LENGTH,
  MINIMUM_ARTICLE_TITLE_LENGTH,
} = constants

describe('NewArticleValidator', () => {
  describe('isThumbnailUrlValid', () => {
    describe('truthy cases', () => {
      const cases = [
        {
          params: {
            thumbnailUrl: 'https://example.com/image.jpg',
          },
        },
        {
          params: {
            thumbnailUrl: 'http://example.com/image.png',
          },
        },
      ]

      test.each(cases)('should return true when thumbnail URL is valid', ({
        params,
      }) => {
        const validator = NewArticleValidator.create({
          articleParams: params,
        })

        expect(validator.isThumbnailUrlValid())
          .toBeTruthy()
      })
    })

    describe('falsy cases', () => {
      const cases = [
        {
          params: {
            thumbnailUrl: '',
          },
        },
        {
          params: {
            thumbnailUrl: 'invalid-url',
          },
        },
        {
          params: {
            thumbnailUrl: null,
          },
        },
      ]

      test.each(cases)('should return false when thumbnail URL is invalid', ({
        params,
      }) => {
        const validator = NewArticleValidator.create({
          articleParams: params,
        })

        expect(validator.isThumbnailUrlValid())
          .toBeFalsy()
      })
    })
  })

  describe('isTitleValid', () => {
    describe('truthy cases', () => {
      const cases = [
        {
          params: {
            title: 'Valid Title',
          },
        },
        {
          params: {
            title: 'A'.repeat(MAX_ARTICLE_TITLE_LENGTH),
          },
        },
      ]

      test.each(cases)('should return true when title is valid', ({
        params,
      }) => {
        const validator = NewArticleValidator.create({
          articleParams: params,
        })

        expect(validator.isTitleValid())
          .toBeTruthy()
      })
    })

    describe('falsy cases', () => {
      const cases = [
        {
          params: {
            title: '',
          },
        },
        {
          params: {
            title: 'A'.repeat(MAX_ARTICLE_TITLE_LENGTH + 1),
          },
        },
        {
          params: {
            title: 'A'.repeat(MINIMUM_ARTICLE_TITLE_LENGTH),
          },
        },
        {
          params: {
            title: null,
          },
        },
      ]

      test.each(cases)('should return false when title is invalid', ({
        params,
      }) => {
        const validator = NewArticleValidator.create({
          articleParams: params,
        })

        expect(validator.isTitleValid())
          .toBeFalsy()
      })
    })
  })

  describe('isContentValid', () => {
    describe('truthy cases', () => {
      const cases = [
        {
          params: {
            content: 'Valid content',
          },
        },
        {
          params: {
            content: 'A long content with multiple paragraphs',
          },
        },
      ]

      test.each(cases)('should return true when content is valid', ({
        params,
      }) => {
        const validator = NewArticleValidator.create({
          articleParams: params,
        })

        expect(validator.isContentValid())
          .toBeTruthy()
      })
    })

    describe('falsy cases', () => {
      const cases = [
        {
          params: {
            content: '',
          },
        },
        {
          params: {
            content: '   ',
          },
        },
        {
          params: {
            content: null,
          },
        },
      ]

      test.each(cases)('should return false when content is invalid', ({
        params,
      }) => {
        const validator = NewArticleValidator.create({
          articleParams: params,
        })

        expect(validator.isContentValid())
          .toBeFalsy()
      })
    })
  })

  describe('isPostedAtValid', () => {
    describe('truthy cases', () => {
      const cases = [
        {
          params: {
            postedAt: '2024-01-01T00:00:00Z',
          },
        },
        {
          params: {
            postedAt: '2024-01-01T00:00:00',
          },
        },
      ]

      test.each(cases)('should return true when posted at is valid', ({
        params,
      }) => {
        const validator = NewArticleValidator.create({
          articleParams: params,
        })

        expect(validator.isPostedAtValid())
          .toBeTruthy()
      })
    })

    describe('falsy cases', () => {
      const cases = [
        {
          params: {
            postedAt: '',
          },
        },
        {
          params: {
            postedAt: 'invalid-date',
          },
        },
        {
          params: {
            postedAt: null,
          },
        },
      ]

      test.each(cases)('should return false when posted at is invalid', ({
        params,
      }) => {
        const validator = NewArticleValidator.create({
          articleParams: params,
        })

        expect(validator.isPostedAtValid())
          .toBeFalsy()
      })
    })
  })

  describe('isTagIdsValid', () => {
    describe('truthy cases', () => {
      const cases = [
        {
          params: {
            tagIds: [1, 2, 3],
          },
        },
        {
          params: {
            tagIds: [1],
          },
        },
      ]

      test.each(cases)('should return true when tag IDs are valid', ({
        params,
      }) => {
        const validator = NewArticleValidator.create({
          articleParams: params,
        })

        expect(validator.isTagIdsValid())
          .toBeTruthy()
      })
    })

    describe('falsy cases', () => {
      const cases = [
        {
          params: {
            tagIds: [-1, 0, 1],
          },
        },
        {
          params: {
            tagIds: ['1', '2'],
          },
        },
        {
          params: {
            tagIds: null,
          },
        },
      ]

      test.each(cases)('should return false when tag IDs are invalid', ({
        params,
      }) => {
        const validator = NewArticleValidator.create({
          articleParams: params,
        })

        expect(validator.isTagIdsValid())
          .toBeFalsy()
      })
    })
  })

  describe('isStatusIdValid', () => {
    describe('truthy cases', () => {
      const cases = [
        {
          params: {
            statusId: 1,
          },
        },
        {
          params: {
            statusId: 100,
          },
        },
      ]

      test.each(cases)('should return true when status ID is valid', ({
        params,
      }) => {
        const validator = NewArticleValidator.create({
          articleParams: params,
        })

        expect(validator.isStatusIdValid())
          .toBeTruthy()
      })
    })

    describe('falsy cases', () => {
      const cases = [
        {
          params: {
            statusId: 0,
          },
        },
        {
          params: {
            statusId: -1,
          },
        },
        {
          params: {
            statusId: 1.5,
          },
        },
        {
          params: {
            statusId: null,
          },
        },
      ]

      test.each(cases)('should return false when status ID is invalid', ({
        params,
      }) => {
        const validator = NewArticleValidator.create({
          articleParams: params,
        })

        expect(validator.isStatusIdValid())
          .toBeFalsy()
      })
    })
  })

  describe('isArticleParamsValid', () => {
    describe('truthy cases', () => {
      const cases = [
        {
          params: {
            thumbnailUrl: 'https://example.com/image.jpg',
            title: 'Valid Title',
            content: 'Valid content',
            postedAt: '2024-01-01T00:00:00Z',
            tagIds: [1, 2, 3],
            statusId: 1,
          },
        },
      ]

      test.each(cases)('should return true when all params are valid', ({
        params,
      }) => {
        const validator = NewArticleValidator.create({
          articleParams: params,
        })

        expect(validator.isArticleParamsValid())
          .toBeTruthy()
      })
    })

    describe('falsy cases', () => {
      const cases = [
        {
          params: {
            thumbnailUrl: '',
            title: 'Valid Title',
            content: 'Valid content',
            postedAt: '2024-01-01T00:00:00Z',
            tagIds: [1, 2, 3],
            statusId: 1,
          },
        },
        {
          params: {
            thumbnailUrl: 'https://example.com/image.jpg',
            title: '',
            content: 'Valid content',
            postedAt: '2024-01-01T00:00:00Z',
            tagIds: [1, 2, 3],
            statusId: 1,
          },
        },
        {
          params: {
            thumbnailUrl: 'https://example.com/image.jpg',
            title: 'Valid Title',
            content: '',
            postedAt: '2024-01-01T00:00:00Z',
            tagIds: [1, 2, 3],
            statusId: 1,
          },
        },
        {
          params: {
            thumbnailUrl: 'https://example.com/image.jpg',
            title: 'Valid Title',
            content: 'Valid content',
            postedAt: '',
            tagIds: [1, 2, 3],
            statusId: 1,
          },
        },
        {
          params: {
            thumbnailUrl: 'https://example.com/image.jpg',
            title: 'Valid Title',
            content: 'Valid content',
            postedAt: '2024-01-01T00:00:00Z',
            tagIds: [1, 2, 3],
            statusId: 0,
          },
        },
      ]

      test.each(cases)('should return false when any param is invalid', ({
        params,
      }) => {
        const validator = NewArticleValidator.create({
          articleParams: params,
        })

        expect(validator.isArticleParamsValid())
          .toBeFalsy()
      })
    })
  })
})
