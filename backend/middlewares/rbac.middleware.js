exports.allowRoles = (...roles) => {
    return (req, res, next) => {
        // Nếu muốn ghi log để fixbug hãy bỏ comment đoạn này
        // console.log("Request user info:", req.user);
        // console.log("Role of current user:", req.user?.role);
        // console.log("ALLOWED:", roles);
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden"});
        }
        next();
    };
};