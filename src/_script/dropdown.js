function initDropdown (module) {
  if (!module) return

  const trigger = module.querySelector('[data-module="app-dropdown-trigger"]')
  const menuId = trigger && trigger.getAttribute('aria-controls')
  const menu = menuId && module.querySelector('#' + menuId)
  menu.setAttribute('data-dropdown-state', 'closed')

  trigger.addEventListener('click', (e) => {
    e.preventDefault()
  })

  module.addEventListener('mouseenter', (e) => {
    menu.setAttribute('data-dropdown-state', 'open')
  })

  module.addEventListener('mouseleave', (e) => {
    menu.setAttribute('data-dropdown-state', 'closed')
  })
}

module.exports = initDropdown
