function initHeader (module) {
  if (!module) return
  const button = module.querySelector('.app-header__menu-button')
  const menu = button && module.querySelector('#' + button.getAttribute('aria-controls'))
  const menuLinks = menu && module.querySelectorAll('.app-header__menu-link')

  function toggleMenu () {
    menu && menu.classList.toggle('app-header__nav--is-open')
    button.classList.toggle('app-header__menu-button--is-open')
  }

  button.addEventListener('click', toggleMenu)

  function toggleSubmenu (menuItem, submenu) {
    menuItem.classList.toggle('app-header__menu-item--is-open')
    submenu.classList.toggle('app-header__submenu-section--is-open')
  }

  function closeCurrentSubmenu (currentlyOpen) {
    const openMenuItem = module.querySelector('.app-header__menu-item--is-open')
    const openSubmenu = module.querySelector('.app-header__submenu-section--is-open')

    if (currentlyOpen !== openSubmenu && openMenuItem && openSubmenu) {
      openMenuItem.classList.remove('app-header__menu-item--is-open')
      openSubmenu.classList.remove('app-header__submenu-section--is-open')
    }
  }

  menuLinks && Array.from(menuLinks).forEach(menuLink => {
    menuLink.addEventListener('click', (e) => {
      const submenuId = menuLink.getAttribute('aria-controls')

      if (submenuId) {
        e.preventDefault()
        const submenu = menu.querySelector('#' + submenuId)
        closeCurrentSubmenu(submenu)
        const menuItem = menuLink.parentElement
        toggleSubmenu(menuItem, submenu)
      }
    })
  })
}

module.exports = initHeader
