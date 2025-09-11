function showErrorPopup(errorTitle, errorMessage, errorCallback) {
  document.getElementById('error-title').innerText =
    errorTitle || 'Error'
  document.getElementById('error-message').innerText =
    errorMessage || 'An unexpected error occurred.'
  const errorContainer = document.getElementById('error-container')
  errorContainer.classList.add('showError')

  // Add event listener to close the popup when clicking the close button
  document
    .getElementById('error-close-btn')
    .addEventListener('click', async () => {
      if ((await hideErrorPopup()) && errorCallback) {
        errorCallback()
      }
    })

  // Automatically hide the popup after 4 seconds
  setTimeout(async () => {
    if ((await hideErrorPopup()) && errorCallback) {
      errorCallback()
    }
  }, 4000)
}

function hideErrorPopup() {
  return new Promise(resolve => {
    const errorContainer = document.getElementById('error-container')
    errorContainer.classList.add('hideError')
    errorContainer.classList.remove('showError')
    setTimeout(() => {
      errorContainer.classList.add('takeErrorPopupBellow')
      errorContainer.classList.remove('hideError')
      setTimeout(() => {
        errorContainer.classList.remove('takeErrorPopupBellow')
        resolve(true)
      }, 300)
    }, 300)
  })
}
