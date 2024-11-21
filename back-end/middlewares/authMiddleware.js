import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);


const verifyToken = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      return res
        .status(401)
        .send({ message: "Authorization header missing", success: false });
    }

    // Extract token from "Bearer <token>"
    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .send({ message: "Token is missing", success: false });
    }
    

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        console.error('Token Verification Error:', err.message);
        return res.status(403).send({ message: 'Token is not valid', success: false });
      }
      console.log('Decoded token:', decode); // Debug
      req.body.userId = decode.id;
      next();
    });

  } catch (error) {
    console.error("Authorization Middleware Error:", error.message);
    res.status(500).send({ message: "Internal server error", success: false });
  }
};

export default verifyToken;
