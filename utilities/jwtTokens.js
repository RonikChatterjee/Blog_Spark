import jwt from 'jsonwebtoken'

const JWT_SECRET =
  process.env.JWT_SECRET || 'Ronik62378932@#BlogSpark74378437'

function generateToken(user) {
  // Create a JWT token with user information, expiration time, secret key & algorithm
  const encodedToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      contact: user.contact,
      gender: user.gender
    },
    JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '24h', // Token will expire in 24 hours
  })
  return encodedToken
}

function verifyToken(token) {
  try {
    // syncronously verify the token using the secret key
    const decodedToken = jwt.verify(token, JWT_SECRET)
    // If the token is valid, it will return the decoded token
    return decodedToken
  } catch (err) {
    console.error(`❌ Error in verifyToken: ${err}`)
    return null // Return null if token verification fails
  }
}

export { generateToken, verifyToken }
