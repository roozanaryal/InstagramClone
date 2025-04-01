import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
try {
    const token = req.cookies.token;
    if (!token) {
       return res.status(401).json({
          message: "Token is required",
          error: true,
          success: false,
       });
     }
     const decode = await jwt.verify(token, process.env.JWT_SECRET);
     if (!decode) {
         return res.status(401).json({
             message: "Token is invalid",
             error: true,
             success: false,
          });
     }
     req.id = decode.userId;
     next();
} catch (error) {
    return res.status(401).json({
        message: "Token is invalid",
        error: true,
        success: false,
     });
}

};

export default isAuthenticated;

