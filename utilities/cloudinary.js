import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

/**
 * @constant cloudinary.config
 * @description Configuration settings for Cloudinary
 * @type {object}
 * @property {string} cloud_name - The Cloudinary cloud name
 * @property {string} api_key - The Cloudinary API key
 * @property {string} api_secret - The Cloudinary API secret
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * @constant extractPublicIdFromSecureUrl
 * @description Extracts the public ID from a Cloudinary secure URL
 * @param {string} secureUrl - The secure URL of the image
 * @returns {string|null} - The public ID if found, null otherwise
 * @example const publicId = extractPublicIdFromSecureUrl('https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg')
 */
function extractPublicIdFromSecureUrl(secureUrl) {
  if (!secureUrl || typeof secureUrl !== 'string') return null
  const secureUrlParts = secureUrl.split('/')
  const publicIdWithExtension = secureUrlParts.pop()
  if (!publicIdWithExtension) return null
  const publicId = publicIdWithExtension.split('.')[0]
  return publicId
}

/**
 * @constant uploadImageToCloudinary
 * @description Uploads an image to Cloudinary
 * @param {string} imagePath - The path to the image file
 * @param {object} options - Additional options for the upload
 * @returns {Promise<string>} - The URL of the uploaded image
 * @example const imageUrl = await uploadImageToCloudinary('/path/to/image.jpg')
 */
async function uploadImageToCloudinary(imagePath) {
  if (!imagePath) {
    console.error('No image path provided')
    return null
  }

  try {
    const response = await cloudinary.uploader.upload(imagePath, {
      resource_type: 'auto',
    })
    console.log('Image uploaded successfully to Cloudinary:', {
      publicId: response.public_id,
      secureUrl: response.secure_url,
      resourceType: response.resource_type,
    })
    return response.secure_url
  } catch (error) {
    console.error('Failed uploading image to Cloudinary', {
      error: error.message,
      stack: error.stack,
    })
    return null
  }
}

/**
 * @constant deleteImageFromCloudinary
 * @description Deletes an image from Cloudinary
 * @param {string} secureUrl - The secure URL of the image to delete
 * @param {object} options - Additional options for the deletion
 * @returns {Promise<boolean>} - Whether the deletion was successful or not
 */
async function deleteImageFromCloudinary(secureUrl) {
  if (!secureUrl || typeof secureUrl !== 'string') {
    console.error('Invalid secure URL provided for image deletion')
    return null
  }
  // Extract publicId from the secureUrl
  const publicId = extractPublicIdFromSecureUrl(secureUrl)
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    })
    console.log('Image deleted successfully from Cloudinary', {
      publicId: publicId,
      result: response.result,
    })
    return response.result
  } catch (error) {
    console.error('Failed deleting image from Cloudinary', {
      error: error.message,
      stack: error.stack,
    })
    return null
  }
}

export {
  extractPublicIdFromSecureUrl,
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
}
