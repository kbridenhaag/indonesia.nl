function initHeader (module) {
  if (!module) return
  const button = module.querySelector('.app-header__menu-button')
  const menu = button && module.querySelector('#' + button.getAttribute('aria-controls'))

  function toggleMenu () {
    menu.classList.toggle('app-header__menu--is-open')
    button.classList.toggle('app-header__menu-button--is-open')
  }

  button.addEventListener('click', toggleMenu)
}

export default initHeader
