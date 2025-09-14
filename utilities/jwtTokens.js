import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

function generateToken(user) {
  let coverImg = user.coverImg
  console.log('Cover Img in generate token: ', coverImg)
  if (
    coverImg === undefined ||
    coverImg === '' ||
    coverImg === null
  ) {
    coverImg = '/images/user_cover_avatar.png'
  }

  let profileImg = user.profileImg
  console.log('Profile Img in generate token: ', profileImg)
  if (
    profileImg === undefined ||
    profileImg === '' ||
    profileImg === null
  ) {
    profileImg = '/images/user_avatar.png'
  }

  let bio = user.bio
  console.log('Bio in generate token: ', bio)
  if (bio === undefined || bio === '' || bio === null) {
    bio = 'Hey there! I am using BlogSpark.'
  }

  let gender = user.gender
  console.log('Gender in generate token: ', gender)
  if (gender === undefined || gender === '' || gender === null) {
    gender = ''
  }

  let contact = user.contact
  console.log('Contact in generate token: ', contact)
  if (contact === undefined || contact === '' || contact === null) {
    contact = ''
  }

  let googleId = user.googleId
  console.log('Google ID in generate token: ', googleId)
  if (
    googleId === undefined ||
    googleId === '' ||
    googleId === null
  ) {
    googleId = ''
  }

  let githubId = user.githubId
  console.log('GitHub ID in generate token: ', githubId)
  if (
    githubId === undefined ||
    githubId === '' ||
    githubId === null
  ) {
    githubId = ''
  }

  let facebookId = user.facebookId
  console.log('Facebook ID in generate token: ', facebookId)
  if (
    facebookId === undefined ||
    facebookId === '' ||
    facebookId === null
  ) {
    facebookId = ''
  }

  // Destructure user information for the JWT token
  const {
    _id,
    email,
    firstname,
    lastname,
    isVerified,
    hasPassword,
    oauthProvider,
  } = user

  // Create a JWT token with user information, expiration time, secret key & algorithm
  const encodedToken = jwt.sign(
    {
      _id,
      coverImg,
      profileImg,
      bio,
      email,
      firstname,
      lastname,
      contact,
      gender,
      isVerified,
      hasPassword,
      oauthProvider,
      googleId,
      githubId,
      facebookId,
    },
    JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '24h', // Token will expire in 24 hours
    }
  )
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
