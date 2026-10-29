export function errorHandler(error, req, res, next) {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "The request body is not valid JSON." });
  }

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({ message: messages.join(" ") });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "value";
    const message =
      field === "email"
        ? "An account with this email already exists."
        : `That ${field} already exists.`;
    return res.status(409).json({ message });
  }

  console.error(error);
  res.status(500).json({ message: "Something went wrong on the server." });
}