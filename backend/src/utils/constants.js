/**
 * Tvarita Arts Collective - Global Constants & Enums
 */

const ROLES = {
    PUBLIC: 'public',
    INSTITUTION: 'institution',
    ARTIST: 'artist',
    ADMIN: 'admin'
};

const ARTIST_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    SUSPENDED: 'suspended'
};

const ART_FORM_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};

const EVENT_STATUS = {
    DRAFT: 'draft',
    PENDING_APPROVAL: 'pending_approval',
    PUBLISHED: 'published',
    ONGOING: 'ongoing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

const EVENT_TYPE = {
    WORKSHOP: 'workshop',
    PERFORMANCE: 'performance',
    MASTERCLASS: 'masterclass',
    EXHIBITION: 'exhibition',
    LEARNING: 'learning'
};

const PRODUCT_STATUS = {
    DRAFT: 'draft',
    PENDING_REVIEW: 'pending_review',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    ARCHIVED: 'archived'
};

const PRODUCT_CATEGORY = {
    PAINTING: 'painting',
    SCULPTURE: 'sculpture',
    TEXTILE: 'textile',
    CRAFT: 'craft',
    JEWELRY: 'jewelry',
    OTHER: 'other'
};

const KNOWLEDGE_TYPE = {
    HISTORY: 'history',
    TRADITION: 'tradition',
    TECHNIQUE: 'technique',
    MATERIAL: 'material',
    STORY: 'story',
    LINEAGE: 'lineage'
};

const KNOWLEDGE_STATUS = {
    DRAFT: 'draft',
    REVIEW: 'review',
    PUBLISHED: 'published',
    ARCHIVED: 'archived'
};

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
    ROLES,
    ARTIST_STATUS,
    ART_FORM_STATUS,
    EVENT_STATUS,
    EVENT_TYPE,
    PRODUCT_STATUS,
    PRODUCT_CATEGORY,
    KNOWLEDGE_TYPE,
    KNOWLEDGE_STATUS,
    LEARNING_STATUS,
    LEARNING_LEVEL
};
