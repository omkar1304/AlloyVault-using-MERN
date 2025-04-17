import jwt from "jsonwebtoken";

const generateToken = (userObj, res) => {
  const token = jwt.sign(userObj, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    sameSite: 'none', // Required for cross-origin cookies
    secure: true, // Required for `sameSite: 'none'` (must be true in production)
    // domain: 'localhost', // Explicitly set the domain
    path: '/', // Ensure the cookie is accessible across all paths
  });

  return token;
};

export default generateToken;
