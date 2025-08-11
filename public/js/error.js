function showErrorPopup(errorTitle, errorMessage, errorCallback) {
  document.getElementById('error-title').innerText =
    errorTitle || 'Error'
  document.getElementById('error-message').innerText =
    errorMessage || 'An unexpected error occurred.'
  const errorBackdrop = document.getElementById('error-backdrop')
  errorBackdrop.classList.remove('hidden')

  // Add event listener to close the popup when clicking outside of it
  errorBackdrop.addEventListener('click', event => {
    if (
      event.target === errorBackdrop &&
      !errorBackdrop.classList.contains('hidden')
    ) {
      hideErrorPopup()
      if (errorCallback) errorCallback()
    }
  })
  // Add event listener to close the popup when clicking the close button
  document
    .getElementById('error-close-btn')
    .addEventListener('click', () => {
      hideErrorPopup()
      if (errorCallback) errorCallback()
    })
  // On pressing the Escape key, Enter key or Space key, close the popup
  document.addEventListener('keydown', event => {
    if (
      event.key === 'Escape' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()
      hideErrorPopup()
      if (errorCallback) errorCallback()
    }
  })

  // Automatically hide the popup after 5 seconds
  setTimeout(() => {
    hideErrorPopup()
    if (errorCallback) errorCallback()
  }, 5000)
}

function hideErrorPopup() {
  const errorBackdrop = document.getElementById('error-backdrop')
  errorBackdrop.classList.add('hidden')
}
