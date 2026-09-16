const baseConstants = require('../constants');

const ARTIST_STATUS = baseConstants.ARTIST_VERIFICATION_STATUS;
const ART_FORM_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};
const EVENT_TYPE = baseConstants.EVENT_TYPES;
const PRODUCT_CATEGORY = {
    PAINTING: 'painting',
    SCULPTURE: 'sculpture',
    TEXTILE: 'textile',
    CRAFT: 'craft',
    JEWELRY: 'jewelry',
    OTHER: 'other'
};
const KNOWLEDGE_TYPE = baseConstants.KNOWLEDGE_TYPES;
const LEARNING_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived'
};
const LEARNING_LEVEL = {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced'
};

module.exports = {
    ...baseConstants,
    ARTIST_STATUS,
    ART_FORM_STATUS,
    EVENT_TYPE,
    PRODUCT_CATEGORY,
    KNOWLEDGE_TYPE,
    LEARNING_STATUS,
    LEARNING_LEVEL
};
