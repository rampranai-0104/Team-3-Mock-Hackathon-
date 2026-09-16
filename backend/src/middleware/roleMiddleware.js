const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user ? req.user.role : 'none'}' is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { authorizeRoles };
