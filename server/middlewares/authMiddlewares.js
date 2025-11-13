import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    // Extract token after "Bearer "
    const token = authHeader.split(' ')[1]; // This gets the actual token

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token format' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Or decoded.id depending on your JWT payload
        console.log('✅ User authenticated:', req.userId); // Debug log
        next();
    } catch (e) {
        console.error('❌ Token verification failed:', e.message);
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
}

export default protect;