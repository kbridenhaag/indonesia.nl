import initHeader from './header'
import Accordion from './accordion'
import { nodeListForEach } from 'kbrinl-frontend/govuk/common'

const body = document.querySelector('.kbrinl-template__body')
body.classList.add('js-enabled')

function initAll () {
  initHeader(document.querySelector('[data-module=app-header]'))

  const $accordions = document.querySelectorAll('[data-module="kbrinl-accordion"]')
  nodeListForEach($accordions, function ($accordion) {
    new Accordion($accordion).init()
  })
}

export { initAll }