// middlewares/requireBpma.js
//
// Memastikan hanya user dengan role BPMA yang bisa melakukan operasi
// langsung (update/delete) terhadap data Stakeholder. Role selain BPMA
// (mis. KKKS) wajib melalui alur change-request (request-change /
// request-delete) yang menunggu persetujuan BPMA terlebih dahulu.
// Middleware ini HARUS dipasang setelah authMiddleware, karena
// bergantung pada req.user yang di-set oleh authMiddleware.
const requireBpma = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authorization required" });
  }

  const role = (req.user.role || "").toLowerCase();
  if (role !== "bpma") {
    return res.status(403).json({
      message:
        "Only BPMA can apply this change directly. Please submit a change/deletion request for BPMA review instead.",
    });
  }

  next();
};

export default requireBpma;
