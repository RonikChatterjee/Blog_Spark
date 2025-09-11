import { validatePassword } from './validate.js'

const showNewPasswordIcon = document.getElementById(
  'showNewPasswordIcon'
)
const hideNewPasswordIcon = document.getElementById(
  'hideNewPasswordIcon'
)
const showConfirmNewPasswordIcon = document.getElementById(
  'showConfirmNewPasswordIcon'
)
const hideConfirmNewPasswordIcon = document.getElementById(
  'hideConfirmNewPasswordIcon'
)
const newPasswordContent = document.getElementById('newPassword')
const confirmNewPasswordContent = document.getElementById(
  'confirmNewPassword'
)
const resetPasswordBtn = document.getElementById('resetPasswordBtn')

// Disable showPasswordIcon initially
document.addEventListener('DOMContentLoaded', () => {
  showNewPasswordIcon.style.display = 'none'
  showConfirmNewPasswordIcon.style.display = 'none'
})

// Toggle New Password visibility on icon click
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

// Toggle Confirm New Password visibility on icon click
hideConfirmNewPasswordIcon.addEventListener('click', () => {
  togglePasswordVisibility(
    hideConfirmNewPasswordIcon,
    showConfirmNewPasswordIcon,
    confirmNewPasswordContent
  )
})
showConfirmNewPasswordIcon.addEventListener('click', () => {
  togglePasswordVisibility(
    showConfirmNewPasswordIcon,
    hideConfirmNewPasswordIcon,
    confirmNewPasswordContent
  )
})

// Handle Reset Password Form Submission
resetPasswordBtn.addEventListener('click', event => {
  event.preventDefault()
  submitResetPassword()
})

/******************** Functions *******************/

// Functions to toggle pasfsword visibility
function togglePasswordVisibility(
  activeIcon,
  inactiveIcon,
  passwordField
) {
  activeIcon.style.display = 'none'
  inactiveIcon.style.display = 'block'
  passwordField.type =
    passwordField.type === 'password' ? 'text' : 'password'
}

// Function to submit the new password after validating
async function submitResetPassword() {
  const newPasswordValue = newPasswordContent.value.trim()
  console.log('New Password:', newPasswordValue)
  const confirmNewPasswordValue =
    confirmNewPasswordContent.value.trim()
  console.log('Confirm New Password:', confirmNewPasswordValue)
  const uniqueURLString = window.location.pathname.split('/').pop()

  // Validate the new password
  if (newPasswordValue !== confirmNewPasswordValue) {
    // newPassword & confirmNewPassword do not match, Show error popup
    showErrorPopup(
      'Error',
      'Passwords do not match./n Enter same passwords in both fields.'
    )
  }
  // Validate the new password
  let error = validatePassword(newPasswordValue)
  if (!error.isValid) {
    // Invalid password, Show error popup
    showErrorPopup('Error', error.message)
  }

  try {
    // newPassword is valid. Submit the new password
    const resJson = await fetch(
      `/verify/reset-password/${uniqueURLString}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Credentials: 'include',
        },
        body: JSON.stringify({
          currentPassword: newPasswordValue,
          newPassword: confirmNewPasswordValue,
        }),
      }
    )
    const resValue = await resJson.json()

    if (resJson.ok) {
      showSuccessPopup('Success', resValue.message, () => {
        window.location.href = '/user/login'
      })
    } else {
      showErrorPopup('Error', resValue.message)
    }
  } catch (error) {
    showErrorPopup(
      'Error',
      `Internal Server Error: ${error.message}./n Please try again later.`
    )
    return
  }
}
