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

// Cookie Options
const COOKIE_OPTIONS = {
  httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
  secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS
  sameSite: 'lax', // Helps protect against CSRF attacks
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set cookie expiration to 1 day
  // maxAge: 24 * 60 * 60 * 1000, // Set cookie expiration to 1 day
}

export { FILE_SIZE_LIMITS, FILE_SIZE_DISPLAY, COOKIE_OPTIONS }
