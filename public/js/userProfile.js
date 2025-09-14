// document.addEventListener('DOMContentLoaded', () => {
//   console.log('User Profile JS Loaded')
//   const url = window.location.href
//   console.log('Current URL:', url)
//   if (url.includes('?verified=false')) {
//     showWarningPopup('Warning', 'Please verify your email id.')
//   }
// })

import {
  validateName,
  validateBio,
  validateGender,
  validateContact,
  validateEmail,
  validatePassword,
  validateOTP,
} from './validate.js'

// Update Image Overlay: Cover and Avatar
const editCoverImage = document.querySelector(
  '[data-edit-cover-image]'
)
const editAvatarImage = document.querySelector(
  '[data-edit-avatar-image]'
)
const updateImgOverlay = document.querySelector(
  '.update-img-overlay-backdrop'
)
const uploadImgLabel = document.querySelector(
  '.update-img-overlay-container label'
)
const uploadImagePreview = document.querySelector(
  '.upload-img-preview'
)
const fileInput = document.getElementById('coverImage')
const uploadAnimation = document.querySelector('.upload-animation')
const progressText = document.querySelector(
  '.upload-progress-details p'
)
const progressBar = document.querySelector('.upload-progress-bar')
const filenameSpan = document.querySelector('.filename')
const uploadSize = document.querySelector('.upload-size')
const submitImgButton = document.querySelector(
  '.update-img-overlay-action button[type="submit"]'
)
const closeImgOverlayButton = document.querySelector(
  '.update-img-overlay-action button[type="button"]'
)

// ✅ Show update image overlay
editCoverImage.addEventListener('click', () => {
  updateImgOverlay.dataset.uploadType = 'cover'
  updateImgOverlay.style.display = 'block'
  // Clear file input
  fileInput.value = ''
})
editAvatarImage.addEventListener('click', () => {
  updateImgOverlay.dataset.uploadType = 'avatar'
  updateImgOverlay.style.display = 'block'
  // Clear file input
  fileInput.value = ''
})

// ✅ Close update image overlay
closeImgOverlayButton.addEventListener('click', () => {
  delete updateImgOverlay.dataset.uploadType
  updateImgOverlay.style.display = 'none'
  resetUploadAnimation()
  // Clear file input
  fileInput.value = ''
})

// ✅ File input change handler
fileInput.addEventListener('change', event => {
  // Show image preview
  const file = event.target.files[0]
  if (file) {
    showImagePreview(uploadImagePreview, file)
  }
})

// ✅ Drag and drop functionality
uploadImgLabel.addEventListener('dragover', event => {
  event.preventDefault()
  uploadImgLabel.style.background = 'rgba(105, 144, 242, 0.2)'
})

uploadImgLabel.addEventListener('dragleave', () => {
  uploadImgLabel.style.background = 'rgba(233, 240, 255, 0.5)'
})

uploadImgLabel.addEventListener('drop', event => {
  event.preventDefault()
  uploadImgLabel.style.background = 'rgba(233, 240, 255, 0.5)'

  const files = event.dataTransfer.files
  if (files.length > 0) {
    // Insert the files into the file input
    fileInput.files = files
    // Show image preview
    const file = files[0]
    if (file) {
      showImagePreview(uploadImagePreview, file)
    }
  }
})

// ✅ Submit button handler
submitImgButton.addEventListener('click', event => {
  event.preventDefault()
  if (updateImgOverlay.dataset.uploadType === 'cover') {
    handleSubmitCoverImage(fileInput)
  } else {
    handleSubmitAvatarImage(fileInput)
  }
})

// ✅ Function to update the uploaded cover image
async function handleSubmitCoverImage(fileInput) {
  if (fileInput.files.length === 0) {
    alert('Please select a file first!')
    return
  }
  console.log('Check Point 1')
  startUploadAnimation(fileInput.files[0])
  const uploadedFormData = new FormData()
  uploadedFormData.append('coverImage', fileInput.files[0])

  // Send the form data to the server
  try {
    console.log('Check Point 2')
    const resJson = await fetch('/user/profile/cover-image', {
      method: 'PATCH',
      body: uploadedFormData,
      credentials: 'include', // Include cookies for authentication
    })
    console.log('resJson: ', resJson)
    const resValue = await resJson.json()
    console.log('resValue: ', resValue)

    if (resJson.ok) {
      // Handle successful response
      console.log('Check Point 3')
      document.querySelector('.user-profile-cover-img img').src =
        resValue.secureUrl
      completeUploadAnimation()
      setTimeout(() => {
        console.log('Check Point 4')
        resetUploadAnimation()
        showSuccessPopup(
          'Success',
          resValue.message || 'Cover image updated successfully!'
        )
      }, 2500)
    } else {
      // Handle error response
      console.log('Check Point 5')
      resetUploadAnimation()
      showErrorPopup('Error', resValue.message)
    }
  } catch (error) {
    console.log('Check Point 6')
    resetUploadAnimation()
    showErrorPopup('Error', error.message)
  }
}

// ✅ Function to update the uploaded avatar image
async function handleSubmitAvatarImage(fileInput) {
  if (fileInput.files.length === 0) {
    alert('Please select a file first!')
    return
  }
  console.log('Check Point 1')
  startUploadAnimation(fileInput.files[0])
  const uploadedFormData = new FormData()
  uploadedFormData.append('avatarImage', fileInput.files[0])

  // Send the form data to the server
  try {
    console.log('Check Point 2')
    const resJson = await fetch('/user/profile/avatar-image', {
      method: 'PATCH',
      body: uploadedFormData,
      credentials: 'include', // Include cookies for authentication
    })
    console.log('resJson: ', resJson)
    const resValue = await resJson.json()
    console.log('resValue: ', resValue)

    if (resJson.ok) {
      // Handle successful response
      console.log('Check Point 3')
      document.querySelector('.user-profile-img img').src =
        resValue.secureUrl
      completeUploadAnimation()
      setTimeout(() => {
        console.log('Check Point 4')
        resetUploadAnimation()
        showSuccessPopup(
          'Success',
          resValue.message || 'Avatar updated successfully!'
        )
      }, 2500)
    } else {
      // Handle error response
      console.log('Check Point 5')
      resetUploadAnimation()
      showErrorPopup('Error', resValue.message)
    }
  } catch (error) {
    console.log('Check Point 6')
    resetUploadAnimation()
    showErrorPopup('Error', error.message)
  }
}

// ✅ Function to show Image Preview
function showImagePreview(parent, file) {
  const reader = new FileReader()
  parent.innerHTML = '' // Clear previous content
  reader.onload = () => {
    const imgPreview = document.createElement('img')
    imgPreview.src = reader.result
    imgPreview.alt = 'Uploaded Image Preview'
    parent.appendChild(imgPreview)
    parent.classList.add('show')
  }
  reader.readAsDataURL(file)
}

// ✅ Function to hide Image Preview
function hideImagePreview(parent) {
  parent.innerHTML = ''
  parent.classList.remove('show')
}

// ✅ Function starting File Uploading Animation
function startUploadAnimation(file) {
  // Show upload animation
  uploadAnimation.classList.add('show')
  uploadImgLabel.classList.add('uploading')

  // Set filename
  filenameSpan.textContent = file.name

  // Reset progress
  progressBar.classList.add('uploading')
  uploadSize.classList.remove('complete')
}

// ✅ Function starting Complete Uploading Animation
function completeUploadAnimation() {
  uploadAnimation.classList.add('complete')
  uploadImgLabel.classList.remove('uploading')
  progressBar.classList.add('complete')
  uploadSize.classList.add('complete')

  // Update progress text
  progressText.innerHTML = `<span class="filename">${filenameSpan.textContent}</span> uploaded successfully!`
}

// ✅ Reset Animation State
function resetUploadAnimation() {
  uploadAnimation.classList.remove('show', 'complete')
  uploadImgLabel.classList.remove('uploading')
  progressBar.classList.remove('uploading', 'complete')
  filenameSpan.textContent = ''
  uploadSize.classList.remove('complete')

  // Reset progress text
  progressText.innerHTML = `<span class="filename">img1.png</span> uploading...`

  // Clear file input
  fileInput.value = ''

  // Hide Image Preview
  hideImagePreview(uploadImagePreview)
}

/************* Update User Name Overlay *************/
const editUserNameButton = document.querySelector(
  '[data-edit-username]'
)
const updateUserNameOverlay = document.querySelector(
  '.update-username-overlay-backdrop'
)
const firstNameInput = document.querySelector('#firstname')
const lastNameInput = document.querySelector('#lastname')
const submitUserNameButton = document.querySelector(
  '.update-username-overlay-container button[type="submit"]'
)
const closeUserNameOverlayButton = document.querySelector(
  '.update-username-overlay-container button[type="button"]'
)

// ✅ Show update user name overlay
editUserNameButton.addEventListener('click', () => {
  // Show overlay logic here
  updateUserNameOverlay.style.display = 'block'
})

// ✅ Close update user name overlay
closeUserNameOverlayButton.addEventListener('click', () => {
  updateUserNameOverlay.style.display = 'none'
})

// ✅ Submit updated username
submitUserNameButton.addEventListener('click', event => {
  event.preventDefault()
  handleUpdatedUserName()
})

/***************** ✅ Functions ******************/

// ✅ Functions to submit the updated username
async function handleUpdatedUserName() {
  const firstname = firstNameInput.value.trim()
  const lastname = lastNameInput.value.trim()

  let error
  error = validateName(firstname)
  if (!error.isValid) {
    // Show error message for firstname
    showErrorPopup('Error', error.message)
    return
  }
  error = validateName(lastname)
  if (!error.isValid) {
    // Show error message for lastname
    showErrorPopup('Error', error.message)
    return
  }

  // If all validations pass, proceed with the update
  try {
    const resJson = await fetch('/user/profile/user-name', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Credentials: 'include', // Include cookies for authentication
      },
      body: JSON.stringify({ firstname, lastname }),
    })
    const resValue = await resJson.json()

    if (resJson.ok) {
      // Update successful
      const fullname = `${firstname} ${lastname}`
      document.querySelector('.user-name h3').textContent = fullname
      showSuccessPopup('Success', resValue.message)
    } else {
      showErrorPopup('Error', resValue.message)
    }
  } catch (error) {
    showErrorPopup('Error', error.message)
  }
}

/************** Update Without Overlay **************/

// ✅ Constants
// Bio
const bioContent = document.querySelector(
  '.user-profile-bio-section textarea'
)
const editBioButton = document.querySelector(
  '.user-profile-bio-section button[type="submit"]'
)
// Gender
const editGenderButton = document.getElementById('gender')
// Contact
const contactContent = document.getElementById('contact')
const editContactButton = document.querySelector(
  '[data-update-contact] button'
)
// Update Password
const currentPasswordContent = document.getElementById('currPassword')
const newPasswordContent = document.getElementById('newPassword')
const editPasswordButton = document.querySelector(
  '[data-update-password] button'
)
// Set Password
const password = document.getElementById('password')
const confirmPassword = document.getElementById('confirmPassword')
const setPasswordButton = document.querySelector(
  '[data-set-password] button'
)
// Toggle Password Visibility
const showCurrentPasswordIcon = document.querySelector(
  '[data-show-current-password]'
)
const hideCurrentPasswordIcon = document.querySelector(
  '[data-hide-current-password]'
)
const showNewPasswordIcon = document.querySelector(
  '[data-show-new-password]'
)
const hideNewPasswordIcon = document.querySelector(
  '[data-hide-new-password]'
)

// ✅ Hide Password by Default
document.addEventListener('DOMContentLoaded', () => {
  showCurrentPasswordIcon.style.display = 'none'
  showNewPasswordIcon.style.display = 'none'
})

// ✅ Toggle Current Password Visibility
hideCurrentPasswordIcon.addEventListener('click', () => {
  togglePasswordVisibility(
    hideCurrentPasswordIcon,
    showCurrentPasswordIcon,
    currentPasswordContent
  )
})
showCurrentPasswordIcon.addEventListener('click', () => {
  togglePasswordVisibility(
    showCurrentPasswordIcon,
    hideCurrentPasswordIcon,
    currentPasswordContent
  )
})

// ✅ Toggle New Password Visibility
hideNewPasswordIcon.addEventListener('click', () => {
  togglePasswordVisibility(
    hideNewPasswordIcon,
    showNewPasswordIcon,
    newPasswordContent
  )
})
showNewPasswordIcon.addEventListener('click', () => {
  togglePasswordVisibility(
    showNewPasswordIcon,
    hideNewPasswordIcon,
    newPasswordContent
  )
})

// ✅ Enable/Disable Bio Update Button based on input
bioContent.addEventListener('input', () => {
  if (bioContent.value.trim().length > 0) {
    editBioButton.disabled = false
  } else {
    editBioButton.disabled = true
  }
})

// ✅ Submit updated bio
editBioButton.addEventListener('click', event => {
  console.log('Edit Bio Button Clicked')
  event.preventDefault()
  handleUpdatedBio()
})

// ✅ Submit updated gender
editGenderButton.addEventListener('change', () => {
  handleUpdatedGender()
})

// ✅ Enable/Disable Contact Update Button based on input
contactContent.addEventListener('input', () => {
  if (contactContent.value.trim().length > 0) {
    editContactButton.disabled = false
  } else {
    editContactButton.disabled = true
  }
})

// ✅ Submit updated contact
editContactButton.addEventListener('click', event => {
  console.log('Edit Contact Button Clicked')
  event.preventDefault()
  handleUpdatedContact()
})

// ✅ Enable/Disable Set Password Button based on input
password.addEventListener('input', () => {
  const passwordLength = password.value.trim().length
  const confirmPasswordLength = confirmPassword.value.trim().length
  if (passwordLength > 0 && confirmPasswordLength > 0) {
    setPasswordButton.disabled = false
  } else {
    setPasswordButton.disabled = true
  }
})
confirmPassword.addEventListener('input', () => {
  const passwordLength = password.value.trim().length
  const confirmPasswordLength = confirmPassword.value.trim().length
  if (passwordLength > 0 && confirmPasswordLength > 0) {
    setPasswordButton.disabled = false
  } else {
    setPasswordButton.disabled = true
  }
})

// ✅ Set Password for the First Time
setPasswordButton.addEventListener('click', event => {
  event.preventDefault()
  handleSetPassword()
})

// ✅ Enable/Disable Password Update Button based on input
currentPasswordContent.addEventListener('input', () => {
  const currentPasswordLength =
    currentPasswordContent.value.trim().length
  const newPasswordLength = newPasswordContent.value.trim().length
  if (currentPasswordLength > 0 && newPasswordLength > 0) {
    editPasswordButton.disabled = false
  } else {
    editPasswordButton.disabled = true
  }
})
newPasswordContent.addEventListener('input', () => {
  const currentPasswordLength =
    currentPasswordContent.value.trim().length
  const newPasswordLength = newPasswordContent.value.trim().length
  if (currentPasswordLength > 0 && newPasswordLength > 0) {
    editPasswordButton.disabled = false
  } else {
    editPasswordButton.disabled = true
  }
})

// ✅ Submit updated password
editPasswordButton.addEventListener('click', event => {
  event.preventDefault()
  handleUpdatedPassword()
})

/*************** Functions to Update Without Overlay ***************/

// ✅ Functions to Update Bio
async function handleUpdatedBio() {
  const bioTextarea = document.querySelector(
    '.user-profile-bio-section textarea'
  )
  const bioInput = bioTextarea.value.trim()

  const error = validateBio(bioInput)
  if (!error.isValid) {
    showErrorPopup('Error', error.message)
    return
  }

  try {
    const resJson = await fetch('/user/profile/bio', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Credentials: 'include', // Include cookies for authentication
      },
      body: JSON.stringify({ bio: bioInput }),
    })
    const resValue = await resJson.json()

    if (resJson.ok) {
      // Update successful
      bioTextarea.value = bioInput
      showSuccessPopup('Success', resValue.message)
    } else {
      showErrorPopup('Error', resValue.message)
    }
  } catch (error) {
    showErrorPopup('Error', error.message)
  }
}

// ✅ Function to Update Gender
async function handleUpdatedGender() {
  const genderInput = editGenderButton.value

  const error = validateGender(genderInput)
  if (!error.isValid) {
    showErrorPopup('Error', error.message)
    return
  }

  try {
    const resJson = await fetch('/user/profile/gender', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Credentials: 'include', // Include cookies for authentication
      },
      body: JSON.stringify({ gender: genderInput }),
    })
    const resValue = await resJson.json()

    if (resJson.ok) {
      // Update successful
      showSuccessPopup('Success', resValue.message)
    } else {
      showErrorPopup('Error', resValue.message)
    }
  } catch (error) {
    showErrorPopup('Error', error.message)
  }
}

//  ✅ Function to Update Contact
async function handleUpdatedContact() {
  const contactInput = document.getElementById('contact')
  const newContact = contactInput.value.trim()

  // Validate the New Contact
  const error = validateContact(newContact)
  if (!error.isValid) {
    showErrorPopup('Error', error.message)
    return
  }

  try {
    const resJson = await fetch('/user/profile/contact', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Credentials: 'include', // Include cookies for authentication
      },
      body: JSON.stringify({ contact: newContact }),
    })
    const resValue = await resJson.json()

    if (resJson.ok) {
      // Update successful
      contactInput.value = newContact
      showSuccessPopup('Success', resValue.message)
    } else {
      showErrorPopup('Error', resValue.message)
    }
  } catch (error) {
    showErrorPopup('Error', error.message)
  }
}

// ✅ Function to Toggle(Show/Hide) Password
function togglePasswordVisibility(
  activeIcon,
  inactiveIcon,
  inputField
) {
  activeIcon.style.display = 'none'
  inactiveIcon.style.display = 'inline'
  inputField.type =
    inputField.type === 'password' ? 'text' : 'password'
}

// ✅ Function to Update Password
async function handleUpdatedPassword() {
  const currPasswordInput = document.getElementById('currPassword')
  const newPasswordInput = document.getElementById('newPassword')
  const currentPassword = currPasswordInput.value.trim()
  const newPassword = newPasswordInput.value.trim()

  // Validate the Passwords
  let error = validatePassword(currentPassword)
  if (!error.isValid) {
    showErrorPopup('Error', 'Current ' + error.message)
    return
  }
  error = validatePassword(newPassword)
  if (!error.isValid) {
    showErrorPopup('Error', 'New ' + error.message)
    return
  }

  try {
    const reJson = await fetch('/user/profile/password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Credentials: 'include', // Include cookies for authentication
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    const resValue = await reJson.json()
    if (reJson.ok) {
      // Update successful
      currPasswordInput.value = ''
      newPasswordInput.value = ''
      editPasswordButton.disabled = true
      showSuccessPopup('Success', resValue.message)
    } else {
      showErrorPopup('Error', resValue.message)
    }
  } catch (error) {
    showErrorPopup('Error', error.message)
  }
}

// ✅ Function to Set Password
async function handleSetPassword() {
  const passwordInput = password.value.trim()
  const confirmPasswordInput = confirmPassword.value.trim()

  // Validate the Passwords
  let error = validatePassword(passwordInput)
  if (!error.isValid) {
    showErrorPopup('Error', 'Password ' + error.message)
    return
  }
  error = validatePassword(confirmPasswordInput)
  if (!error.isValid) {
    showErrorPopup('Error', 'Confirm ' + error.message)
    return
  }
  if (passwordInput !== confirmPasswordInput) {
    showErrorPopup('Error', 'Passwords do not match!')
    return
  }

  // If all validations pass, set the password
  try {
    const resJson = await fetch('/user/profile/password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Credentials: 'include', // Include cookies for authentication
      },
      body: JSON.stringify({
        currentPassword: passwordInput,
        newPassword: confirmPasswordInput,
      }),
    })
    const resValue = await resJson.json()

    if (resJson.ok) {
      password.value = ''
      confirmPassword.value = ''
      setPasswordButton.disabled = true
      showSuccessPopup('Success', resValue.message, () => {
        location.reload()
      })
    } else {
      showErrorPopup('Error', resValue.message)
    }
  } catch (error) {
    showErrorPopup('Error', error.message)
  }
}

/************* Email Verification Overlay *************/

// Constants
const emailField = document.querySelector('[data-email-field] input')
const emailBtnSection = document.querySelector(
  '[data-email-field] .user-profile-field-action'
)
console.log('Email Button Section:', emailBtnSection)
const emailActionButton = document.querySelector(
  '[data-email-field] button'
)
console.log('Email Action Button:', emailActionButton)

const closeVerifyEmailOverlayButton = document.querySelector(
  '.verify-email-overlay-action button[type="button"]'
)
const verifyEmailOverlay = document.querySelector(
  '.verify-email-overlay-backdrop'
)

// ✅ Enable/Disable Updated State based on input
emailField.addEventListener('input', () => {
  if (
    emailBtnSection.dataset.verifyEmail !== undefined ||
    emailBtnSection.dataset.verifiedEmail !== undefined
  ) {
    emailActionButton.textContent = 'Update'
    emailBtnSection.dataset.updateEmail = true
    delete emailBtnSection.dataset.verifyEmail
    delete emailBtnSection.dataset.verifiedEmail
  }
})

// ✅ Email Action Button Clicked
emailActionButton.addEventListener('click', event => {
  event.preventDefault()
  const btnSection = document.querySelector(
    '[data-email-field] .user-profile-field-action'
  )
  if (btnSection.dataset.updateEmail !== undefined) {
    console.log('Update Email Button Clicked', Date.now())
    handleUpdatedEmail()
  } else if (btnSection.dataset.verifyEmail !== undefined) {
    console.log('Verify Email Button Clicked', Date.now())
    verifyEmail()
  } else if (btnSection.dataset.verifiedEmail !== undefined) {
    console.log('Verified Email Button Clicked', Date.now())
  }
})

// ✅ Close Verify Email Overlay Button Clicked
closeVerifyEmailOverlayButton.addEventListener('click', event => {
  event.preventDefault()
  closeVerifyEmailOverlay()
})

/****************** Functions to Update & Verify Email *******************/
let verifyEmailSocket = null
let verifyEmailTimeout = null
let resendTimeout = null
let resendInterval = null

// ✅ Function to send Verification Mail via Verification Link
function verifyEmail() {
  try {
    // Establishing Socket Connection
    /**
     * If you are running your JS in module scope (type="module"), io is attached to the global window object.
     * Hence io is not defined in the module scope.
     * Use window.io() to access the Socket.IO client when using ES modules.
     */
    verifyEmailSocket = io()
    verifyEmailSocket.on('connect', async () => {
      let socketId
      if (!socketId) {
        socketId = verifyEmailSocket.id
      }
      console.log('✔ Socket Connected:', socketId)
      // Catching an event from backend about email verification status
      verifyEmailSocket.on(
        'emailVerificationStatus',
        async response => {
          console.log('📧 Email Verification Status:', response)
          if (response.status) {
            //  Disconnect the socket
            verifyEmailSocket.disconnect()
            verifyEmailSocket = null
            console.log(
              'verifyEmailSocket disconnected after success.'
            )
            const resJson = await fetch('/verify/set-cookie', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Credentials: 'include', // Include cookies for authentication
              },
            })
            const resValue = await resJson.json()
            if (!resJson.ok) {
              showErrorPopup('Error', resValue.message)
              return
            }
            showSuccessPopup('Success', resValue.message)
            setTimeout(() => {
              closeVerifyEmailOverlay()
              setTimeout(() => {
                location.reload()
              }, 500)
            }, 3000)
          }
        }
      )

      // Send request to server to send verification email
      const resJson = await fetch('/user/profile/email/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Credentials: 'include', // Include cookies for authentication
        },
        body: JSON.stringify({ socketId }), // Send socketId to server
      })

      if (resJson.ok) {
        // Email send successfully
        // Clear any existing timeout for resending email
        if (verifyEmailTimeout) {
          if (verifyEmailTimeout !== null) {
            clearTimeout(verifyEmailTimeout)
            verifyEmailTimeout = null
            console.log(
              'Socket Timeout Cleared: New verification email sent.'
            )
          }
        }

        // Set a timeout to disconnect the socket after 5 minutes if no action is taken
        verifyEmailTimeout = setTimeout(() => {
          if (verifyEmailSocket) {
            verifyEmailSocket.disconnect()
            verifyEmailSocket = null
            verifyEmailTimeout = null
            console.log(
              'verifyEmailSocket disconnected due to timeout.'
            )
          }
        }, 5 * 60 * 1000) // 5 minutes timeout to resend the email

        // Open the email verification overlay
        verifyEmailOverlay.style.display = 'block'
        handleOTPInput()

        // Disable the resend link & enable it after 60 seconds
        const resendLink = document.querySelector(
          '.verify-email-overlay-container a'
        )
        resendLink.setAttribute('disabled', 'true')
        resendTimeout = setTimeout(() => {
          resendLink.removeAttribute('disabled')
          resendTimeout = null
          console.log(
            '⏰ Resend Timeout: You can resend the verification email now.'
          )
          // Resend link clicked
          resendLink.addEventListener('click', event => {
            event.preventDefault()
            if (verifyEmailSocket) {
              verifyEmailSocket.disconnect()
              verifyEmailSocket = null
              console.log(
                'verifyEmailSocket disconnected due to resend.'
              )
            }
            if (resendTimeout === null) {
              verifyEmail()
            }
          })
        }, 60 * 1000)

        // Resend Counter Display (1minutes) logic
        const resendSpan = document.querySelector(
          '.verify-email-overlay-container a span'
        )
        let countdown = 60
        resendSpan.textContent = `(${countdown}s)`
        resendInterval = setInterval(() => {
          countdown--
          resendSpan.textContent = `(${countdown}s)`
          if (countdown <= 0) {
            clearInterval(resendInterval)
            resendInterval = null
            resendSpan.textContent = ''
          }
        }, 1000)

        // Show success popup
        showSuccessPopup(
          'Success',
          'Verification email sent successfully!'
        )
      } else {
        // Show error popup
        showErrorPopup('Error', 'Failed to send verification email.')
      }
    })
  } catch (error) {
    // Log the error
    console.error('✖ Error Sending Verification Email:', error)
    // Show error popup
    showErrorPopup('Error', error.message)
  }
}

// ✅ Function to close the Verify Email Overlay
function closeVerifyEmailOverlay() {
  if (resendTimeout) {
    clearTimeout(resendTimeout)
    resendTimeout = null
  }
  if (resendInterval) {
    clearInterval(resendInterval)
    resendInterval = null
  }
  verifyEmailOverlay.style.display = 'none'
}

// ✅ Function to define behavior for the input field for otp verification
// Submit otp is called here
function handleOTPInput() {
  const otpInputs = document.querySelectorAll(
    '[data-verification-code] input'
  )
  const otpVerifyBtn = document.querySelector(
    '.verify-email-overlay-action button[type="submit"]'
  )
  console.log(otpInputs)
  otpInputs.forEach((input, index) => {
    // handle input event
    input.addEventListener('input', event => {
      // Move to the next input if not the last one
      if (index < otpInputs.length - 1 && input.value) {
        otpInputs[index + 1].focus()
      }
      // Enable the verify button if all inputs are filled
      const otpCode = Array.from(otpInputs)
        .map(input => input.value)
        .join('')
      otpVerifyBtn.disabled = otpCode.length !== otpInputs.length
    })

    // handle keyup event
    input.addEventListener('keyup', event => {
      if (event.key === 'Backspace') {
        if (index > 0) {
          otpInputs[index - 1].focus()
        }
      } else if (event.key === 'ArrowRight') {
        if (index < otpInputs.length - 1) {
          otpInputs[index + 1].focus()
        }
      } else if (event.key === 'ArrowLeft') {
        if (index > 0) {
          otpInputs[index - 1].focus()
        }
      }
    })

    // handle paste event
    input.addEventListener('paste', event => {
      event.preventDefault()
      const pasteData = event.clipboardData.getData('text')
      const otpValues = pasteData.split('').slice(0, otpInputs.length)
      otpInputs.forEach((input, index) => {
        input.value = otpValues[index] || ''
      })
    })

    // Submit OTP if it contains 6 digits valid inputs
    otpVerifyBtn.addEventListener('click', submitOTP)
  })
}

// ✅ Function to submit OTP for verification
async function submitOTP() {
  try {
    const otpInputs = document.querySelectorAll(
      '[data-verification-code] input'
    )
    const otpCode = Array.from(otpInputs)
      .map(input => input.value)
      .join('')

    // Validate OTP
    const error = validateOTP(otpCode)
    if (!error.isValid) {
      showErrorPopup('Error', error.message)
      return
    }

    // Submit OTP
    const resJson = await fetch('/verify/email/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Credentials: 'include', // Include cookies for authentication
      },
      body: JSON.stringify({ otpCode }), // Send OTP code to server
    })
    const resValue = await resJson.json()

    if (!resJson.ok) {
      showErrorPopup('Error', resValue.message)
    }
  } catch (error) {
    console.error('✖ Error Submitting OTP:', error)
    showErrorPopup('Error', error.message)
  }
}

// ✅ Function to Update Email
async function handleUpdatedEmail() {
  const emailInput = document.getElementById('email')
  const newEmail = emailInput.value.trim()

  // Validate the New Email
  const error = validateEmail(newEmail)
  if (!error.isValid) {
    showErrorPopup('Error', error.message)
    return
  }

  try {
    const resJson = await fetch('/user/profile/email/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Credentials: 'include', // Include cookies for authentication
      },
      body: JSON.stringify({ email: newEmail }),
    })
    const resValue = await resJson.json()
    if (resJson.ok) {
      // Update successful
      emailInput.value = newEmail
      emailInput.placeholder = newEmail
      showSuccessPopup('Success', resValue.message)
      delete emailBtnSection.dataset.updateEmail
      delete emailBtnSection.dataset.verifiedEmail
      emailBtnSection.dataset.verifyEmail = true
      emailActionButton.textContent = 'Verify'
    } else {
      showErrorPopup('Error', resValue.message)
    }
  } catch (error) {
    showErrorPopup('Error', error.message)
  }
}
