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

module.exports = {
  ROLES,
  ARTIST_VERIFICATION_STATUS,
  MEDIA_TYPES
};
