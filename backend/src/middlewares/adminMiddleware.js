// ✅ FIXED: Robust check to ensure 'admin' role is recognized
const adminMiddleware = (req, res, next) => {
  // Debug: Check your terminal to see if this is 'admin' or undefined
  console.log("🔍 Admin Check - User Role:", req.user?.role);

  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({ 
    message: "Forbidden: Admin privileges required for this action." 
  });
};

module.exports = adminMiddleware;