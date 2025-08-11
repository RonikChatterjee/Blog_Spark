import { validateEmail, validatePassword } from './validate.js'

// document.addEventListener('DOMContentLoaded', () => {
// })
postLoginFormData()

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
            window.location.href = 'http://localhost:8000'
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
