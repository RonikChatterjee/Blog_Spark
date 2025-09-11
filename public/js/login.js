import { validateEmail, validatePassword } from './validate.js'

const showPasswordIcon = document.querySelector(
  '[data-show-password]'
)
const hidePasswordIcon = document.querySelector(
  '[data-hide-password]'
)
const passwordContent = document.getElementById('password')
const forgotPasswordLink = document.querySelector(
  '.login-footer .forgot-password'
)

// Disable showPasswordIcon initially
document.addEventListener('DOMContentLoaded', () => {
  showPasswordIcon.style.display = 'none'
})

// Toggle password visibility on icon click
hidePasswordIcon.addEventListener('click', () => {
  togglePasswordVisibility(
    hidePasswordIcon,
    showPasswordIcon,
    passwordContent
  )
})
showPasswordIcon.addEventListener('click', () => {
  togglePasswordVisibility(
    showPasswordIcon,
    hidePasswordIcon,
    passwordContent
  )
})

// Handle POST Login Form Data
postLoginFormData()

// Handle Reset Password (Forgot Password)
forgotPasswordLink.addEventListener('click', event => {
  event.preventDefault()
  resetPassword()
})

/****************** Functions ******************/

// ✅ Function to Reset Password (Forgot Password)
async function resetPassword() {
  console.log('Reset Password Clicked')

  const forgotPasswordOverlay = document.querySelector(
    '.forgot-password-overlay-backdrop'
  )

  // Display the overlay
  forgotPasswordOverlay.style.display = 'block'

  // Hide the overlay
  document
    .querySelector(
      '.forgot-password-overlay-action button[type = "button"]'
    )
    .addEventListener('click', () => {
      forgotPasswordOverlay.style.display = 'none'
    })

  // Submit the user email for sending reset password link
  document
    .querySelector(
      '.forgot-password-overlay-action button[type = "submit"]'
    )
    .addEventListener('click', async event => {
      event.preventDefault()
      const emailField = document.getElementById(
        'forgot-password-email'
      )
      const email = emailField.value.trim()

      // Validate the email
      const error = validateEmail(email)

      if (!error.isValid) {
        // Invalid email, Show error popup
        showErrorPopup('Error', error.message)
        return
      }

      // Send the email to backend for sending reset password link
      try {
        const resJson = await fetch('/user/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Credentials: 'include',
          },
          body: JSON.stringify({ email }),
        })
        const resValue = await resJson.json()

        if (resJson.ok) {
          showSuccessPopup('Success', resValue.message, () => {
            emailField.value = ''
            forgotPasswordOverlay.style.display = 'none'
            return
          })
        } else {
          showErrorPopup('Error', resValue.message)
        }
      } catch (error) {
        showErrorPopup(
          'Error',
          `Failed to send reset password link. Please try again later.`
        )
        return
      }
    })
}

// ✅ Function to Toggle Password Visibility
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

// ✅ Function to POST Login Form Data
function postLoginFormData() {
  document
    .getElementById('login-btn')
    .addEventListener('click', async event => {
      event.preventDefault()

      // Extracting the user input data from the form
      const form = document.querySelector('#login-form')
      const formData = new FormData(form)
      const data = Object.fromEntries(formData)

      // Validate the form data
      const validEmail = validateEmail(data.email)
      if (!validEmail.isValid) {
        const errorMessage = `Login Failed\n${validEmail.message}`
        showErrorPopup('Error', errorMessage)
        return
      }
      const validPassword = validatePassword(data.password)
      if (!validPassword.isValid) {
        const errorMessage = `Login Failed\n${validPassword.message}`
        showErrorPopup('Error', errorMessage)
        return
      }

      //   Submit the form data to backend
      try {
        const resJson = await fetch('/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        const resValue = await resJson.json()

        if (resJson.status === 200) {
          showSuccessPopup('Success', resValue.message, () => {
            window.location.href = '/'
            return
          })
          return
        }

        const errorMessage = `Login Failed\n${
          resValue.message || 'Please try again.'
        }`
        showErrorPopup('Error', errorMessage)
      } catch (err) {
        showErrorPopup(
          'Error',
          `Login Failed\n Please try again later`
        )
      }
    })
}
