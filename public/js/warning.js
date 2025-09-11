function showWarningPopup(warningTitle, warningMessage, warningCallback) {
  document.getElementById('warning-title').innerText =
    warningTitle || 'Warning'
  document.getElementById('warning-message').innerText =
    warningMessage || 'An unexpected warning occurred.'
  const warningContainer = document.getElementById('warning-container')
  warningContainer.classList.add('showWarning')

  // Add event listener to close the popup when clicking the close button
  document
    .getElementById('warning-close-btn')
    .addEventListener('click', async () => {
      if ((await hideWarningPopup()) && warningCallback) {
        warningCallback()
      }
    })

  // Automatically hide the popup after 4 seconds
  setTimeout(async () => {
    if ((await hideWarningPopup()) && warningCallback) {
      warningCallback()
    }
  }, 4000)
}

function hideWarningPopup() {
  return new Promise(resolve => {
    const warningContainer = document.getElementById('warning-container')
    warningContainer.classList.add('hideWarning')
    warningContainer.classList.remove('showWarning')
    setTimeout(() => {
      warningContainer.classList.add('takeWarningPopupBellow')
      warningContainer.classList.remove('hideWarning')
      setTimeout(() => {
        warningContainer.classList.remove('takeWarningPopupBellow')
        resolve(true)
      }, 300)
    }, 300)
  })
}
