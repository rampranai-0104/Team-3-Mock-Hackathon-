const Product = require("../../models/Product");

const getApprovedProducts = async (req, res) => {
    try {
        const { search, artForm, artist, category, minPrice, maxPrice, inStock } = req.query;
        let filter = { status: "approved" };

        if (artForm) {
            filter.artFormId = artForm;
        }

        if (artist) {
            filter.artistId = artist;
        }

        if (category) {
            filter.category = category.toLowerCase();
        }

        if (inStock === "true") {
            filter.stock = { $gt: 0 };
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const products = await Product.find(filter)
            .populate("artFormId", "name slug")
            .populate("artistId", "displayName profileImage location")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            status: "approved"
        })
            .populate("artFormId", "name slug description media")
            .populate("artistId", "displayName bio profileImage location");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product details fetched successfully",
            data: product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getApprovedProducts,
    getProductById
};
