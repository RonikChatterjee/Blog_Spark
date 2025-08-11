import { validateFormData } from './validate.js'

postSignUpFormData()

function postSignUpFormData() {
  console.log('postSignUpFormData called')

  document
    .querySelector('#signup-btn')
    .addEventListener('click', async event => {
      // Prevent the default form submission
      event.preventDefault()
      // Extracting the user input data from the form
      const form = document.querySelector('#signup-form')
      const formData = new FormData(form)
      const data = Object.fromEntries(formData)

      // Validate the form data
      const error = validateFormData(data)
      if (!error.isValid) {
        showErrorPopup('Error', error.message)
        return
      }

      // Removing all the leading and trailing whitespaces from the data
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          data[key] = data[key].trim()
        }
      }

      // Submit the form data
      try {
        const resJson = await fetch('/user/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        const resValue = await resJson.json()

        console.log('Response (JSON):', resJson)
        console.log('Response (Value):', resValue)

        if (resJson.status === 201) {
          console.log('Show Success Popup')
          showSuccessPopup(
            'Success',
            resValue.message || 'User signed up successfully!',
            () => {
              window.location.href = '/user/login'
              return
            }
          )
          return
        }
        const errorMessage = `Failed to signup\n${
          resValue.message || 'Please try again.'
        }`
        showErrorPopup('Error', errorMessage)
      } catch (err) {
        showErrorPopup(
          'Error',
          'Submitting user data failed\n Please try again later.'
        )
      }
    })
}
