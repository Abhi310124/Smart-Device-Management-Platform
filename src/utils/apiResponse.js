export function ok(res, data = {}, message = "OK") {
  return res.status(200).json({ success: true, message, ...data });
}

export function created(res, data = {}, message = "Created") {
  return res.status(201).json({ success: true, message, ...data });
}

export function badRequest(res, message = "Bad Request") {
  return res.status(400).json({ success: false, message });
}

export function unauthorized(res, message = "Unauthorized") {
  return res.status(401).json({ success: false, message });
}

export function forbidden(res, message = "Forbidden") {
  return res.status(403).json({ success: false, message });
}

export function notFound(res, message = "Not Found") {
  return res.status(404).json({ success: false, message });
}

export function serverError(res, message = "Internal Server Error") {
  return res.status(500).json({ success: false, message });
}
