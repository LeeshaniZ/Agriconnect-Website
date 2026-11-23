const { admin } = require('../config/firebaseAdmin');

const authenticate = async (req, res, next) => {
  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(match[1]);
    req.user = decodedToken;
    return next();
  } catch (error) {
    console.warn('Authentication failed:', error.message);
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
};

module.exports = authenticate;
