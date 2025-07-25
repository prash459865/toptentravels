import jwt from 'jsonwebtoken';


export const verifyToken = (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const headerToken = req.headers?.authorization;

  console.log("Cookie Token:", cookieToken);
  console.log("Authorization Header:", headerToken);

  const token = cookieToken || headerToken;
  
  
  if (!token) {
    return res.status(401).json({ success: false, message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    console.log(req.userId,"from verify token")
    next();
  } catch (error) {
    console.log(error,'from verifyToken')
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
