import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { FILE_SIZE_LIMITS, FILE_SIZE_DISPLAY } from '../constants.js'

const uploadsDir = '../uploads'
// check if the directory is present or not
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}

/**
 * @function removeFilesFromUploadsDir
 * @description Cleanup uploaded files from uploads directory
 * @param {Object} req - Express request object containing file information
 * @returns {void}
 * @note Call this after successful upload to cloud or on error
 * @example removeFilesFromUploadsDir(req)
 */
function removeFilesFromUploadsDir(req) {
  if (req.file) {
    console.log('req.file', req.file)
    const fileToBeDeleted = path.join(uploadsDir, req.file.filename)
    fs.rmSync(fileToBeDeleted)
  }
}

/**
 * @function autoCleanupUploadsDir
 * @description Middleware to automatically cleanup temp files after request completion
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 * @note This runs after all middlewares and controllers have finished
 * @note Prevents memory leaks by cleaning up temporary files
 * @example app.use(autoCleanupUploadsDir)
 */
const autoCleanupUploadsDir = (req, res, next) => {
  const originalEnd = res.end
  const originalJson = res.json
  const originalSend = res.send

  let cleanupDone = false
  const performCleanup = () => {
    if (!cleanupDone) {
      cleanupDone = true
      removeFilesFromUploadsDir(req)
    }
  }

  // Override res.end to perform cleanup
  res.end = function (...args) {
    performCleanup()
    originalEnd.call(this, ...args)
  }
  // Override res.json to perform cleanup
  res.json = function (...args) {
    performCleanup()
    originalJson.call(this, ...args)
  }
  // Override res.send to perform cleanup
  res.send = function (...args) {
    performCleanup()
    originalSend.call(this, ...args)
  }

  // Cleanup on request close (client disconnect, errors, etc.)
  req.on('close', performCleanup)
  req.on('aborted', performCleanup)

  // Cleanup on response finish
  res.on('finish', performCleanup)
  res.on('close', performCleanup)

  next()
}

/**
 * @constant diskStorage
 * @description Storage configuration for multer
 * @type {Object}
 * @property {Function} destination -
 * @property {Function} filename -
 * @note Files are stored in ../uploads with timestamped filenames
 * @note Sanitizes filenames to prevent security issues
 */
const diskStorage = multer.diskStorage({
  /**
   * @function destination
   * @description destination is used to determine within which folder the uploaded files should be stored. This can also be given as a string (e.g. '/tmp/uploads'). If no destination is given, the operating system's default directory for temporary files is used.
   * [Note: You are responsible for creating the directory when providing destination as a function. When passing a string, multer will make sure that the directory is created for you.]
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} cb - Callback function to indicate where to store the file.
   * @returns {void}
   */
  destination: (req, res, cb) => {
    try {
      // Check wheather the file is accessable and writeable or not
      fs.accessSync(uploadsDir, fs.constants.W_OK)
      cb(null, '../uploads')
    } catch (error) {
      cb(
        new Error('Upload directory is not accessible or writable'),
        null
      )
    }
  },
  /**
   * @function filename
   * @description filename is used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn't include any file extension.
   * [Note: Multer will not append any file extension for you, your function should return a filename complete with a file extension.]
   * @param {Object} req - The request object.
   * @param {Object} file - The file object.
   * @param {Function} cb - Callback function to indicate the file name.
   * @returns {void}
   */
  filename: (req, file, cb) => {
    try {
      // Creating a unique file name by adding the extension and a unique suffix manually
      const uniqueSuffix =
        Date.now() + '-' + Math.round(Math.random() * 1e9)
      const ext = path.extname(file.originalname)
      cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    } catch (error) {
      cb(new Error('Error generating filename'), null)
    }
  },
})

/**
 * @section File Filters
 * @description File filters for specific file types validation
 */

/**
 * @function imageFileFilter
 * @description Validates image file uploads
 * @param {Object} req - Express request object
 * @param {Object} file - Multer file object
 * @param {Function} cb - Callback function
 * @returns {void}
 * @throws {Error} Invalid file format or unsupported image type
 * @note Accepts: JPEG, JPG, PNG
 * @example multer({ fileFilter: imageFileFilter })
 */
const imageFileFilter = (req, file, cb) => {
  const acceptedFormats = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ]
  try {
    if (!file) {
      return cb(new Error('No file provided'), false)
    }

    if (acceptedFormats.includes(file.mimetype)) {
      return cb(null, true)
    } else {
      return cb(new Error('Invalid file type'), false)
    }
  } catch (error) {
    return cb(new Error('Error processing file'), false)
  }
}

// ***********************************************************
// Specifying the limits for the file that is uploaded
/**
 * ------------Limits that can be specified-------------
 * fieldNameSize:-      Max field name size |	100 bytes
 * fieldSize:-
      -Meaning: The maximum size (in bytes) allowed for non-file fields in the multipart form.
      -Applies to: Text fields (req.body values).
      -Default: 1 MB (1,048,576 bytes).
      -Use case: Restricts how much text data (like JSON or long strings) a user can send in form fields.
      -Max field value size (in bytes)|	1MB
 * fields:- 	Max number of non-file fields|	Infinity
 * fileSize:-    	For multipart forms,
      -Meaning: The maximum size (in bytes) allowed for each individual file.
      -Applies to: Uploaded files (req.file or req.files).
      -Use case: Prevents users from uploading files that are too large (e.g., 5MB per file).
      -Max file size (in bytes)|	Infinity
 * files:-    For multipart forms,
      -Meaning: Maximum number of files allowed to be uploaded in a single request.
      -Applies to: Only <input type="file"> parts of the form (not text fields).
      -Default: Unlimited (unless you set it), the max number of file fields -> Infinity.
      -Error if exceeded: Multer throws a LIMIT_FILE_COUNT error.
 * parts:-	For multipart forms, the max number of parts (fields + files)|	    Infinity
 * headerPairs:-	For multipart forms, the max number of header key=>value pairs to parse|	    2000
 */
// ************************************************************

/**
 * @section Upload Configurations
 * @description Upload configurations for different file types with specific size limits
 */

/**
 * @constant uploadProfilePicture
 * @description Multer configuration for image uploads
 * @type {Object}
 * @property {Object} storage - Storage configuration
 * @property {Function} fileFilter - Image file filter
 * @property {Object} limits - File size and count limits
 * @note Maximum file size: 5MB per image
 * @note Maximum files: 1 images per request
 * @note Supported formats: JPEG, JPG, PNG
 * @example uploadProfilePicture.single('avatar'), uploadProfilePicture.fields([{name: 'avatar', maxCount: 1}])
 */

// For any image - 5MB
const uploadAvatarImage = multer({
  storage: diskStorage,
  limit: {
    fileSize: FILE_SIZE_LIMITS.AVATAR, // 5MB
    files: 1,
  },
  fileFilter: imageFileFilter,
})

// For any image - 10MB
const uploadCoverImage = multer({
  storage: diskStorage,
  limits: {
    fileSize: FILE_SIZE_LIMITS.IMAGE, // 10MB
    files: 1,
  },
  fileFilter: imageFileFilter,
})

/**
 * @function getMulterErrorMessage
 * @description Helper function to get user-friendly multer error message
 * @param {Error} err - Multer error object
 * @returns {string} User-friendly error message
 * @note Follows project's error handling pattern
 * @note Provides field-specific size limit information
 * @example const message = getMulterErrorMessage(multerError)
 */
const getMulterErrorMessage = err => {
  let message = 'File upload error'

  switch (err.code) {
    case 'LIMIT_FILE_SIZE':
      const fieldName = err.field || 'file'
      let sizeLimit = FILE_SIZE_DISPLAY.IMAGE // default

      // Get specific size limits based on field
      if (fieldName === 'coverImage') {
        sizeLimit = FILE_SIZE_DISPLAY.IMAGE
      } else if (fieldName === 'avatar') {
        sizeLimit = FILE_SIZE_DISPLAY.AVATAR
      }

      message = `File size too large for ${fieldName}. Maximum allowed size is ${sizeLimit}.`
      break

    case 'LIMIT_FILE_COUNT':
      message =
        'Too many files uploaded. Please check the file count limit.'
      break

    case 'LIMIT_FIELD_KEY':
      message = 'Field name is too long.'
      break

    case 'LIMIT_FIELD_VALUE':
      message = 'Field value is too long.'
      break

    case 'LIMIT_FIELD_COUNT':
      message = 'Too many fields in the form.'
      break

    case 'LIMIT_UNEXPECTED_FILE':
      message = `Unexpected field: ${err.field}. Please check the field name.`
      break

    case 'MISSING_FIELD_NAME':
      message = 'Missing field name in the form.'
      break

    default:
      message = `File upload error: ${err.message}`
  }

  return message
}

/**
 * @constant handleMulterError
 * @description Middleware to handle multer errors and provide user-friendly error messages
 * @param {Object} err - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
const handleMulterError = (err, req, res, next) => {
  if (req.file) {
    removeFilesFromUploadsDir(req)
  }

  if (err instanceof multer.MulterError) {
    const message = getMulterErrorMessage(err)
    return res.status(400).json({ message })
  }

  // If the err is not a error of multer then pass the control to the next middleware
  next()
}

export {
  autoCleanupUploadsDir,
  uploadAvatarImage,
  uploadCoverImage,
  handleMulterError,
}
