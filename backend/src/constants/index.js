const ROLES = Object.freeze({
  PUBLIC: 'public',
  INSTITUTION: 'institution',
  ARTIST: 'artist',
  ADMIN: 'admin'
});

const ARTIST_VERIFICATION_STATUS = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
});

const MEDIA_TYPES = Object.freeze({
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  DOCUMENT: 'document'
});

const REQUEST_STATUS = Object.freeze({
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
});

const EVENT_STATUS = Object.freeze({
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  PUBLISHED: 'published',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
});

const EVENT_TYPES = Object.freeze({
  WORKSHOP: 'workshop',
  PERFORMANCE: 'performance',
  EXHIBITION: 'exhibition',
  MASTERCLASS: 'masterclass',
  TALK: 'talk'
});

const PRODUCT_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  ARCHIVED: 'archived'
});

const PRODUCT_MODERATION_STATUS = Object.freeze({
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ARCHIVED: 'archived'
});

const BOOKING_STATUS = Object.freeze({
  PENDING: 'pending',
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
  REFUNDED: 'refunded'
});

const ORDER_STATUS = Object.freeze({
  CREATED: 'created',
  PENDING: 'pending',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
});

const PAYMENT_STATUS = Object.freeze({
  CREATED: 'created',
  AUTHORIZED: 'authorized',
  CAPTURED: 'captured',
  REFUNDED: 'refunded',
  FAILED: 'failed'
});

const KNOWLEDGE_STATUS = Object.freeze({
  DRAFT: 'draft',
  REVIEW: 'review',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
});

const KNOWLEDGE_TYPES = Object.freeze({
  HISTORY: 'history',
  TECHNIQUE: 'technique',
  MATERIAL: 'material',
  STORY: 'story',
  LINEAGE: 'lineage',
  ARTICLE: 'article'
});

module.exports = {
  ROLES,
  ARTIST_VERIFICATION_STATUS,
  MEDIA_TYPES,
  REQUEST_STATUS,
  EVENT_STATUS,
  EVENT_TYPES,
  PRODUCT_STATUS,
  PRODUCT_MODERATION_STATUS,
  BOOKING_STATUS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  KNOWLEDGE_STATUS,
  KNOWLEDGE_TYPES
};
