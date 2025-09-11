import { Users, Verification } from '../models/index.js'
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from '../utilities/cloudinary.js'
import { hashPassword, verifyPassword } from '../utilities/hash.js'
import { generateToken } from '../utilities/jwtTokens.js'
import { sendVerificationEmail } from '../utilities/nodemailer.js'
import { generateOTP } from '../utilities/otpGenerator.js'
import generateUniqueString from '../utilities/nanoid.js'
import dotenv from 'dotenv'
dotenv.config()

/**
 * @constant handleGetUserProfile
 * @description Controller used to get the profile of the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {RenderingContext} - Renders the user profile page with user data.
 * @throws {Error} - Throws an error if there is an issue getting the user profile.
 */
function handleGetUserProfile(req, res) {
  // Extract user data from user object
  const {
    coverImg,
    profileImg,
    bio,
    firstname,
    lastname,
    gender,
    contact,
    email,
    isVerified,
  } = req.user

  // return res.status(200).json({ ...req.user })
  return res.render('userProfile', {
    layout: 'layouts/base_format_loggedin',
    locals: {
      coverImg,
      profileImg,
      bio,
      fullname: `${firstname} ${lastname}`,
      firstname,
      lastname,
      gender,
      contact,
      email,
      emailVerified: isVerified,
    },
  })
}

/**
 * @constant handleUpdateCoverImage
 * @description Controller used to update the cover image of the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns a promise that resolves when the cover image is updated.
 * @throws {Error} - Throws an error if there is an issue updating the cover image.
 */
async function handleUpdateCoverImage(req, res) {
  const uploadedFile = req.file
  if (!uploadedFile) {
    return res
      .status(400)
      .json({ message: 'Please provide a cover image.' })
  }
  // console.log('Uploaded File: ', uploadedFile)

  try {
    // Getting the old image secureUrl from the database
    const oldImageUrl = req.user.coverImg

    // Upload the uploadedImage into Cloudinary
    const secureUrl = await uploadImageToCloudinary(uploadedFile.path)

    // Update the user's cover image secureUrl into the database if already an image secureUrl is present, else add the secureUrl
    await Users.findByIdAndUpdate(req.user._id, {
      coverImg: secureUrl,
    })

    // Modify the user object in req to reflect the new cover image
    req.user.coverImg = secureUrl

    // Update the cookies with the new user data
    res.cookie('jwtToken', generateToken(req.user))

    // Delete the old image from Cloudinary if it exists after updating the new image secureUrl into the database
    if (oldImageUrl) {
      await deleteImageFromCloudinary(oldImageUrl)
    }

    return res.status(200).json({
      secureUrl,
      message: 'Cover image updated successfully!',
    })
  } catch (error) {
    console.error('Error uploading cover image:', error)
    return res
      .status(500)
      .json({ message: 'Error uploading cover image.' })
  }
}

/**
 * @constant handleUpdateAvatar
 * @description Controller used to update the avatar image of the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns a promise that resolves when the avatar image is updated.
 * @throws {Error} - Throws an error if there is an issue updating the avatar image.
 */
async function handleUpdateAvatar(req, res) {
  const uploadedFile = req.file
  if (!uploadedFile) {
    return res
      .status(400)
      .json({ message: 'Please provide an avatar image.' })
  }

  try {
    // Getting the old image secureUrl from the database
    const oldImageUrl = req.user.profileImg

    // Upload the uploadedImage into Cloudinary
    const secureUrl = await uploadImageToCloudinary(uploadedFile.path)

    // Update the user's avatar image secureUrl into the database if already an image secureUrl is present, else add the secureUrl
    await Users.findByIdAndUpdate(req.user._id, {
      profileImg: secureUrl,
    })

    // Modify the user object in req to reflect the new avatar image
    req.user.profileImg = secureUrl

    // Update the cookies with the new user data
    res.cookie('jwtToken', generateToken(req.user))

    // Delete the old image from Cloudinary if it exists after updating the new image secureUrl into the database
    if (oldImageUrl) {
      await deleteImageFromCloudinary(oldImageUrl)
    }

    return res.status(200).json({
      secureUrl,
      message: 'Profile picture updated successfully!',
    })
  } catch (error) {
    console.error('Error updating profile picture:', error)
    return res
      .status(500)
      .json({ message: 'Error updating profile picture' })
  }
}

/**
 * @constant handleUpdateUserName
 * @description Controller used to update the username of the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns a promise that resolves when the username is updated.
 * @throws {Error} - Throws an error if there is an issue updating the username.
 */
async function handleUpdateUserName(req, res) {
  const { firstname, lastname } = req.body

  try {
    // Update the firstname & lastname into user's database
    await Users.findByIdAndUpdate(req.user._id, {
      firstname,
      lastname,
    })

    // Modify the user object in req to reflect the new username
    req.user.firstname = firstname
    req.user.lastname = lastname

    // Update the cookies with the new user data
    res.cookie('jwtToken', generateToken(req.user))

    return res
      .status(200)
      .json({ message: 'Username updated successfully!' })
  } catch (error) {
    console.error('Error updating username:', error)
    return res
      .status(500)
      .json({ message: 'Error updating username.\nTry again later.' })
  }
}

/**
 * @constant handleUpdateBio
 * @description Controller used to update the bio of the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns a promise that resolves when the bio is updated.
 * @throws {Error} - Throws an error if there is an issue updating the bio.
 */
async function handleUpdateBio(req, res) {
  const { bio } = req.body

  try {
    await Users.findByIdAndUpdate(req.user._id, {
      bio,
    })

    // Modify the user object in req to reflect the new bio
    req.user.bio = bio
    // Update the cookies with the new user data
    res.cookie('jwtToken', generateToken(req.user))

    return res
      .status(200)
      .json({ message: 'Bio updated successfully!' })
  } catch (error) {
    console.error('Error updating bio:', error)
    return res
      .status(500)
      .json({ message: 'Error updating bio.\nTry again later.' })
  }
}

/**
 * @constant handleUpdateGender
 * @description Controller used to update the gender of the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns a promise that resolves when the gender is updated.
 * @throws {Error} - Throws an error if there is an issue updating the gender.
 */
async function handleUpdateGender(req, res) {
  const { gender } = req.body

  try {
    // Update the user's gender in the database
    await Users.findByIdAndUpdate(req.user._id, {
      gender,
    })

    // Modify the user object in req to reflect the new gender
    req.user.gender = gender
    // Update the cookies with the new user data
    res.cookie('jwtToken', generateToken(req.user))

    return res
      .status(200)
      .json({ message: 'Gender updated successfully!' })
  } catch (error) {
    console.error('Error updating gender:', error)
    return res
      .status(500)
      .json({ message: 'Error updating gender.\nTry again later.' })
  }
}

/**
 * @constant handleUpdateContact
 * @description Controller used to update the contact information of the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns a promise that resolves when the contact information is updated.
 * @throws {Error} - Throws an error if there is an issue updating the contact information.
 */
async function handleUpdateContact(req, res) {
  const { contact } = req.body

  try {
    // Update the user's contact in the database
    await Users.findByIdAndUpdate(req.user._id, {
      contact,
    })

    // Modify the user object in req to reflect the new contact
    req.user.contact = contact
    // Update the cookies with the new user data
    res.cookie('jwtToken', generateToken(req.user))

    return res
      .status(200)
      .json({ message: 'Contact updated successfully!' })
  } catch (error) {
    console.error('Error updating contact:', error)
    return res
      .status(500)
      .json({ message: 'Error updating contact.\nTry again later.' })
  }
}

/**
 * @constant handleVerifyEmail
 * @description Controller used to send a verification email to the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns a promise that resolves when the verification email is sent.
 * @throws {Error} - Throws an error if there is an issue sending the verification email.
 */
async function handleVerifyEmail(req, res) {
  // console.log('HandleVerifyEmail called')
  const { socketId } = req.body
  const userEmail = req.user.email
  const verificationOTP = generateOTP()
  const verificationLINK = generateUniqueString(32)
  try {
    // Sending verification email
    const response = await sendVerificationEmail(
      userEmail,
      verificationOTP,
      `${process.env.BASE_URL}/verify/email/${verificationLINK}`
    )

    /********** check the verification email sent or not **********/
    if (response) {
      // Verification email sent successfully
      // Delete the verification details of this user for event = 'emailVerification', if it already exists
      await Verification.deleteMany({
        userId: req.user._id,
        event: 'EMAIL_VERIFICATION',
      })

      // Store the userId, otp, url, socket.id, event, expiresAt in the Verification collection
      await Verification.insertOne({
        userId: req.user._id,
        otp: verificationOTP,
        url: verificationLINK,
        socketId,
        event: 'EMAIL_VERIFICATION',
        expiresAt: Date.now() + 6 * 60 * 1000, // 6 minutes from now
      })

      res
        .status(200)
        .json({ message: 'Verification email sent successfully!' })
    } else {
      // Verification email failed to send
      res.status(500).json({
        message:
          'Error sending verification email. Please try again later.',
      })
    }
  } catch (error) {
    console.error('Error sending verification email:', error)
    return res.status(500).json({
      message:
        'Error sending verification email. Please try again later.',
    })
  }
}

/**
 * @constant handleUpdateEmail
 * @description Controller used to update the email of the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns a promise that resolves when the email is updated.
 * @throws {Error} - Throws an error if there is an issue updating the email.
 */
async function handleUpdateEmail(req, res) {
  const { email } = req.body

  try {
    // Check the new email is already in use by another user or not
    const existingUser = await Users.findOne({ email })
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Email is already in use by another user.' })
    }
    // Update the user's email in the database
    await Users.findByIdAndUpdate(req.user._id, {
      email,
    })

    // Modify the user object in req to reflect the new email
    req.user.email = email
    req.user.isVerified = false
    // Update the cookies with the new user data
    res.cookie('jwtToken', generateToken(req.user))

    return res
      .status(200)
      .json({ message: 'Email updated successfully!' })
  } catch (error) {
    console.error('Error updating email:', error)
    return res
      .status(500)
      .json({ message: 'Error updating email.\nTry again later.' })
  }
}

/**
 * @constant handleUpdatePassword
 * @description Controller used to update the password of the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns a promise that resolves when the password is updated.
 * @throws {Error} - Throws an error if there is an issue updating the password.
 */
async function handleUpdatePassword(req, res) {
  const { currentPassword, newPassword } = req.body

  try {
    // Verify the current password
    const userObj = await Users.findById(req.user._id)
    const hashedPassword = userObj.password
    const isMatch = await verifyPassword(
      hashedPassword,
      currentPassword
    )
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: 'Current password is incorrect.' })
    }

    // Hash the new password
    const newHashedPassword = await hashPassword(newPassword)

    // Update the user's password in the database
    await Users.findByIdAndUpdate(req.user._id, {
      password: newHashedPassword,
    })

    return res
      .status(200)
      .json({ message: 'Password updated successfully!' })
  } catch (error) {
    console.error('Error updating password:', error)
    return res
      .status(500)
      .json({ message: 'Error updating password.\nTry again later.' })
  }
}

export {
  handleGetUserProfile,
  handleUpdateCoverImage,
  handleUpdateAvatar,
  handleUpdateUserName,
  handleUpdateBio,
  handleUpdateGender,
  handleUpdateContact,
  handleUpdateEmail,
  handleVerifyEmail,
  handleUpdatePassword,
}
