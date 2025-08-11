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

// getUserProfile()
logoutUser()

function getUserProfile() {
  document
    .getElementById('user-option-profile')
    .addEventListener('click', async event => {
      event.preventDefault()
      try {
        const resJson = await fetch('/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
        const resValue = await resJson.json()
        console.log('resJson -> ', resJson)
        console.log('resValue -> ', resValue)
      } catch (err) {
        showErrorPopup(
          'Error',
          'Failed to fetch user profile. Please try again later.',
          () => {
            window.location.href = 'http://localhost:8000'
          }
        )
      }
    })
}

function logoutUser() {
  document
    .getElementById('user-option-logout')
    .addEventListener('click', async event => {
      event.preventDefault()
      try {
        const resJson = await fetch('/user/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
        if (resJson.status === 200) {
          window.location.href = 'http://localhost:8000'
        }
      } catch (err) {
        showErrorPopup(
          'Error',
          'Failed to logout. Please try again later.'
        )
      }
    })
}
