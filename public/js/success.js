function showSuccessPopup(
  successTitle,
  successMessage,
  successCallback
) {
  document.getElementById('success-title').innerText =
    successTitle || 'Success'
  document.getElementById('success-message').innerText =
    successMessage || 'Operation completed successfully.'

  const successContainer = document.getElementById(
    'success-container'
  )
  successContainer.classList.add('showSuccess')

  // Add event listener to close the popup when clicking the OK button
  document
    .getElementById('success-ok-btn')
    .addEventListener('click', async () => {
      if ((await hideSuccessPopup()) && successCallback) {
        successCallback()
      }
    })
  // Automatically hide the popup after 4 seconds
  setTimeout(async () => {
    if ((await hideSuccessPopup()) && successCallback) {
      successCallback()
    }
  }, 4000)
}

function hideSuccessPopup() {
  return new Promise(resolve => {
    const successContainer = document.getElementById(
      'success-container'
    )
    successContainer.classList.add('hideSuccess')
    successContainer.classList.remove('showSuccess')
    setTimeout(() => {
      successContainer.classList.add('takeSuccessPopupBellow')
      successContainer.classList.remove('hideSuccess')
      setTimeout(() => {
        successContainer.classList.remove('takeSuccessPopupBellow')
        resolve(true)
      }, 300)
    }, 300)
  })
}
