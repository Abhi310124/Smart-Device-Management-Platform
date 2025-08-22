export default function validate(schema) {
  return (req, res, next) => {
    const data = ["GET", "DELETE"].includes(req.method)
      ? req.query
      : req.body;
    const { error } = schema.validate(data, { abortEarly: false, stripUnknown: true });
    if (error) {
      const details = error.details.map(d => d.message).join(", ");
      const e = new Error(details);
      e.status = 400;
      return next(e);
    }
    // attach cleaned data if you prefer: req.validated = value
    next();
  };
}
