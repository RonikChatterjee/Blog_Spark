function showSuccessPopup(
  successTitle,
  successMessage,
  successCallback
) {
  document.getElementById('success-title').innerText =
    successTitle || 'Success'
  document.getElementById('success-message').innerText =
    successMessage || 'Operation completed successfully.'

  const successBackdrop = document.getElementById('success-backdrop')
  successBackdrop.classList.remove('hidden')

  // Add event listener to close the popup when clicking outside of it
  successBackdrop.addEventListener('click', event => {
    if (
      event.target === successBackdrop &&
      !successBackdrop.classList.contains('hidden')
    ) {
      hideSuccessPopup()
      if (successCallback) successCallback()
    }
  })
  // Add event listener to close the popup when clicking the OK button
  document
    .getElementById('success-ok-btn')
    .addEventListener('click', () => {
      hideSuccessPopup()
      if (successCallback) successCallback()
    })
  // On pressing the Escape key, Enter key or Space key, close the popup
  document.addEventListener('keydown', event => {
    if (
      event.key === 'Escape' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()
      hideSuccessPopup()
      if (successCallback) successCallback()
    }
  })

  // Automatically hide the popup after 5 seconds
  setTimeout(() => {
    hideSuccessPopup()
    if (successCallback) successCallback()
  }, 5000)
}

function hideSuccessPopup() {
  const successBackdrop = document.getElementById('success-backdrop')
  successBackdrop.classList.add('hidden')
}
