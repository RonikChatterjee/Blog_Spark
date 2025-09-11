function validateFormData(data) {
  // Validate the form data
  const error = {}
  const validFirstName = validateName(data.firstname)
  if (!validFirstName.isValid) {
    error.isValid = false
    error.message = validFirstName.message
    return error
  }
  const validLastName = validateName(data.lastname)
  if (!validLastName.isValid) {
    error.isValid = false
    error.message = validLastName.message
    return error
  }
  const validGender = validateGender(data.gender)
  if (!validGender.isValid) {
    error.isValid = false
    error.message = validGender.message
    return error
  }
  const validContact = validateContact(data.contact)
  if (!validContact.isValid) {
    error.isValid = false
    error.message = validContact.message
    return error
  }
  const validEmail = validateEmail(data.email)
  if (!validEmail.isValid) {
    error.isValid = false
    error.message = validEmail.message
    return error
  }
  const validPassword = validatePassword(data.password)
  if (!validPassword.isValid) {
    error.isValid = false
    error.message = validPassword.message
    return error
  }
  return { isValid: true }
}

// ----------------Validate individual fields--------------------
function validateBio(bio) {
  if (
    bio === undefined ||
    bio === null ||
    bio === '' ||
    bio.trim() === ''
  ) {
    return { isValid: false, message: 'Enter your bio' }
  }
  // Check the length of the bio
  if (bio.length < 10 || bio.length > 300) {
    return {
      isValid: false,
      message:
        'Invalid bio.\n Bio should be between 10 and 300 characters long.',
    }
  }
  return { isValid: true }
}

function validateName(name) {
  if (
    name === undefined ||
    name === null ||
    name === '' ||
    name.trim() === ''
  ) {
    return { isValid: false, message: 'Enter your name' }
  }
  // Remove leading/trailing whitespace
  name = name.trim()
  // Check if name contains only letters and spaces
  const regex = /^[a-zA-Z]+$/
  if (!regex.test(name)) {
    return {
      isValid: false,
      message: 'Invalid name.\n Name should contain only letters.',
    }
  }
  // Check the length of the name
  if (name.length < 2 || name.length > 25) {
    return {
      isValid: false,
      message:
        'Invalid name.\n Name should be between 2 and 25 characters long.',
    }
  }
  return { isValid: true }
}

function validateGender(gender) {
  // Check the gender is valid or NOT
  // Check if gender is provided
  if (gender === undefined || gender === null || gender === '') {
    return { isValid: false, message: 'Select your gender' }
  }
  // Valid Genders
  const validGenders = ['male', 'female', 'other']
  const isValid = validGenders.includes(gender.toLowerCase())
  if (!isValid) {
    return {
      isValid: false,
      message:
        'Invalid gender.\n Gender should be male, female, or other.',
    }
  }
  return { isValid: true }
}

function validateContact(contact) {
  // Check if contact is a valid phone number or email
  if (
    contact === undefined ||
    contact === null ||
    contact === '' ||
    contact.trim() === ''
  ) {
    return {
      isValid: false,
      message: 'Enter your contact number',
    }
  }
  const trimmedContact = contact.trim()
  // Remove all non-digit characters for processing after trimming
  const cleanedNumber = trimmedContact.replace(/\D/g, '')
  // Multiple regex patterns for different formats
  // Indian mobile numbers (10 digits starting with 6-9)
  const indianPattern = /^[6-9]\d{9}$/
  // Match the number with patterns

  if (!indianPattern.test(cleanedNumber)) {
    return {
      isValid: false,
      message:
        'Invalid contact number.\n Contact number should be a valid Indian mobile number.',
    }
  }
  if (cleanedNumber.length < 10 || cleanedNumber.length > 15) {
    return {
      isValid: false,
      message:
        'Invalid contact number.\n Contact number should contain 10 to 15 digits.',
    }
  }
  return { isValid: true }
}

function validateEmail(email) {
  // Check if email is valid
  if (
    email === undefined ||
    email === null ||
    email === '' ||
    email.trim() === ''
  ) {
    return {
      isValid: false,
      message: 'Enter your email address',
    }
  }
  // Remove leading/trailing whitespace
  const trimmedEmail = email.trim()
  // Production-grade email validation regex
  const regex =
    /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/
  if (!regex.test(trimmedEmail)) {
    return {
      isValid: false,
      message:
        'Invalid email address.\n Enter a valid email, e.g. user@example.com',
    }
  }
  // Check email length
  if (trimmedEmail.length > 254) {
    return {
      isValid: false,
      message:
        'Invalid email address.\n Email should not exceed 254 characters.',
    }
  }
  // Extracting the Local Part of the email
  const localParts = trimmedEmail.split('@')[0]
  // Check if local part is empty or exceeds 64 characters
  if (localParts.length === 0 || localParts.length > 64) {
    return {
      isValid: false,
      message:
        'Invalid email address.\n Local part should not be empty or exceed 64 characters.',
    }
  }
  return { isValid: true }
}

function validatePassword(password) {
  if (
    password === undefined ||
    password === null ||
    password === ''
  ) {
    return {
      isValid: false,
      message: 'Enter your password',
    }
  }
  // Check min length of the password
  if (password.length < 8 || password.length > 128) {
    return {
      isValid: false,
      message:
        'Invalid password.\n Password should be between 8 and 128 characters long.',
    }
  }
  // Password Requirements
  const requirements = {
    // At least one lowercase letter
    lowercase: /[a-z]/,
    // At least one uppercase letter
    uppercase: /[A-Z]/,
    // At least one digit
    digit: /\d/,
    // At least one special character
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/,
    // No whitespace characters
    noWhitespace: /^\S*$/,
  }
  // Check all requirements
  if (!requirements.lowercase.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter',
    }
  }
  if (!requirements.uppercase.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter',
    }
  }
  if (!requirements.digit.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one digit',
    }
  }
  if (!requirements.special.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character',
    }
  }
  if (!requirements.noWhitespace.test(password)) {
    return {
      isValid: false,
      message: 'Password must not contain any whitespace characters',
    }
  }
  return { isValid: true }
}

// ------------------------Other Field Validation------------------------

function validateOTP(otp) {
  // Check if OTP is valid
  if (
    otp === undefined ||
    otp === null ||
    otp === '' ||
    otp.trim() === ''
  ) {
    return {
      isValid: false,
      message: 'Enter the OTP',
    }
  }
  // Remove leading/trailing whitespace
  const trimmedOTP = otp.trim()
  // Check if OTP is exactly 6 characters
  const regex = /^[^\s]{6}$/
  if (!regex.test(trimmedOTP)) {
    return {
      isValid: false,
      message: 'Invalid OTP.\n Enter a valid OTP.',
    }
  }
  return { isValid: true }
}

export {
  validateFormData,
  validateBio,
  validateName,
  validateGender,
  validateContact,
  validateEmail,
  validatePassword,
  validateOTP,
}
