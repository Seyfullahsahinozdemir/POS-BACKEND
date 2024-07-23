import jsonwebtoken from "jsonwebtoken";
import { TokenPayload } from "../interfaces/token.payload.interface";

const secretKey = process.env.SECRET_KEY || "";

export const generateToken = (payload: TokenPayload): string => {
  return jsonwebtoken.sign(payload, secretKey, { expiresIn: "1d" });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decodedToken = jsonwebtoken.verify(token, secretKey) as TokenPayload;
    return decodedToken;
  } catch (error) {
    return null;
  }
};
