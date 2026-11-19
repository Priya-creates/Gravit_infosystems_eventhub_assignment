exports.checkAdmin = (req, res, next) => {
  const adminSecret = req.headers["x-admin-secret"]; // frontend se bhejna hoga
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Admin only" });
  }
  next();
};
