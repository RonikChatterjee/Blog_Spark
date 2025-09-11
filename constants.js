// Environment Variables\

// File Upload Limits (in bytes)
const FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024, // 10MB for images (avatar, coverImage, thumbnail)
  AVATAR: 5 * 1024 * 1024, // 5MB for avatar
  DOCUMENT: 10 * 1024 * 1024, // 10MB for documents (if needed in future)
}

// File Upload Limits in Human Readable Format
const FILE_SIZE_DISPLAY = {
  IMAGE: '10MB',
  AVATAR: '5MB',
  DOCUMENT: '10MB',
}

export { FILE_SIZE_LIMITS, FILE_SIZE_DISPLAY }
