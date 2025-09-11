// --------------- For Mobile View ----------------

const mobileNavbarActionDown = document.getElementById(
  'mobile-navbar-action-down'
)
const mobileNavbarActionUp = document.getElementById(
  'mobile-navbar-action-up'
)

mobileNavbarActionDown.addEventListener('click', () =>
  expandMobileNavbar()
)
mobileNavbarActionUp.addEventListener('click', () =>
  contractMobileNavbar()
)

function expandMobileNavbar() {
  document
    .getElementById('mobile-navbar-menu')
    .classList.remove('contract-mobile-navbar-menu')
  mobileNavbarActionDown.classList.add('hidden')
  mobileNavbarActionUp.classList.remove('hidden')
}

function contractMobileNavbar() {
  document
    .getElementById('mobile-navbar-menu')
    .classList.add('contract-mobile-navbar-menu')
  mobileNavbarActionDown.classList.remove('hidden')
  mobileNavbarActionUp.classList.add('hidden')
}

// --------------- For Desktop View ----------------
document
  .getElementById('user-option-logout')
  .addEventListener('click', event => {
    event.preventDefault()
    logoutUser()
  })

document
  .getElementById('user-option-logout-mobile')
  .addEventListener('click', event => {
    event.preventDefault()
    logoutUser()
  })

async function logoutUser() {
  try {
    const resJson = await fetch('/user/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    if (resJson.status === 200) {
      window.location.href = '/'
    }
  } catch (err) {
    showErrorPopup(
      'Error',
      'Failed to logout. Please try again later.'
    )
  }
}
