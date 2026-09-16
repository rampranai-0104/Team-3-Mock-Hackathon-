const ArtForm = require('../models/ArtForm');
const Artist = require('../models/Artist');
const Event = require('../models/Event');
const Product = require('../models/Product');
const KnowledgeItem = require('../models/KnowledgeItem');
const {
    ART_FORM_STATUS,
    ARTIST_STATUS,
    EVENT_STATUS,
    PRODUCT_STATUS,
    KNOWLEDGE_STATUS
} = require('../utils/constants');

/**
 * Global Public Search Service
 * Searches across approved and published public collections
 */
const globalPublicSearch = async (query = '', options = {}) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
        return {
            artForms: [],
            artists: [],
            events: [],
            products: [],
            knowledge: [],
            totalMatches: 0
        };
    }

    const limit = Math.min(parseInt(options.limit, 10) || 5, 20);
    const regex = new RegExp(trimmedQuery, 'i');

    const [artForms, artists, events, products, knowledge] = await Promise.all([
        // 1. Art Forms (Active only)
        ArtForm.find({
            status: ART_FORM_STATUS.ACTIVE,
            $or: [
                { name: regex },
                { description: regex },
                { regions: regex },
                { techniques: regex }
            ]
        })
            .select('name slug description regions media status')
            .limit(limit)
            .lean(),

        // 2. Artists (Approved only)
        Artist.find({
            verificationStatus: ARTIST_STATUS.APPROVED,
            $or: [
                { displayName: regex },
                { bio: regex },
                { 'location.state': regex },
                { 'location.city': regex }
            ]
        })
            .populate('artFormIds', 'name slug')
            .select('displayName bio location languages experience profileImage verificationStatus availability')
            .limit(limit)
            .lean(),

        // 3. Events (Published only)
        Event.find({
            status: EVENT_STATUS.PUBLISHED,
            $or: [
                { title: regex },
                { description: regex },
                { 'location.city': regex },
                { type: regex }
            ]
        })
            .populate('artFormIds', 'name slug')
            .populate('artistIds', 'displayName profileImage')
            .select('title type description date time location price capacity availableSeats image status')
            .limit(limit)
            .lean(),

        // 4. Products (Approved only)
        Product.find({
            $or: [
                { moderationStatus: 'approved' },
                { status: 'approved' }
            ],
            status: { $ne: 'archived' },
            $and: [
                {
                    $or: [
                        { name: regex },
                        { title: regex },
                        { description: regex },
                        { category: regex }
                    ]
                }
            ]
        })
            .populate('artFormId', 'name slug')
            .populate('artistId', 'displayName profileImage')
            .select('name title description price stock category images media status moderationStatus')
            .limit(limit)
            .lean(),

        // 5. Knowledge (Published only)
        KnowledgeItem.find({
            status: KNOWLEDGE_STATUS.PUBLISHED,
            $or: [
                { title: regex },
                { content: regex },
                { summary: regex },
                { type: regex }
            ]
        })
            .populate('artFormId', 'name slug')
            .select('title slug type summary media language status createdAt')
            .limit(limit)
            .lean()
    ]);

    const totalMatches =
        artForms.length +
        artists.length +
        events.length +
        products.length +
        knowledge.length;

    return {
        artForms,
        artists,
        events,
        products,
        knowledge,
        totalMatches
    };
};

module.exports = {
    globalPublicSearch
};
