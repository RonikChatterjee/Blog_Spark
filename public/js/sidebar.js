const hamburger = document.getElementById('hamburger')
const cross = document.getElementById('sidebar-cross')
const sidebar = document.getElementById('sidebar')

function expandSidebar() {
  sidebar.classList.remove('sidebar-contract')
  sidebar.classList.add('sidebar-expand')
}

function contractSidebar() {
  sidebar.classList.remove('sidebar-expand')
  sidebar.classList.add('sidebar-contract')
}

function initialiseSidebar() {
  const mediaQuery = window.matchMedia(
    '(min-width: 648px) and (max-width: 1023px)'
  )
  if (mediaQuery.matches) {
    contractSidebar()
  }
}

window.addEventListener('resize', initialiseSidebar)
document.addEventListener('DOMContentLoaded', initialiseSidebar)

if (hamburger) {
  hamburger.addEventListener('click', () => {
    if (sidebar.classList.contains('sidebar-contract')) {
      expandSidebar()
    }
    //  else {
    //   contractSidebar()
    // }
  })
}

if (cross) {
  cross.addEventListener('click', () => {
    console.log('Cross clicked')
    if (sidebar.classList.contains('sidebar-expand')) {
      console.log('Contracting sidebar')
      contractSidebar()
    }
  })
}
