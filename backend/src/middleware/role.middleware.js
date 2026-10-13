const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role ? String(req.user.role).trim().toLowerCase() : '';
    const normalizedAllowed = allowedRoles.map((r) => String(r).trim().toLowerCase());

    if (!req.user || !normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Insufficient permissions for this action. Required role: ${allowedRoles.join(' or ')}`
      });
    }
    next();
  };
};

module.exports = { authorizeRoles };
