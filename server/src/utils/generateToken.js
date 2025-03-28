import jwt from "jsonwebtoken";


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
    });
};

export default generateToken;