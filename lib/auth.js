import jwt from "jsonwebtoken";

export function verifyAuth(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("SECRET_MISSING");
  }

  return jwt.verify(token, process.env.JWT_SECRET);
}
