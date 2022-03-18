const initHeader = require('./header')
const { nodeListForEach } = require('govuk-frontend/govuk/common')
const initDropdown = require('./dropdown')

const body = document.querySelector('.kbrinl-template__body')
body.classList.add('js-enabled')

function initAll () {
  initHeader(document.querySelector('[data-module=app-header]'))

  const $dropdowns = document.querySelectorAll('[data-module="app-dropdown"]')
  nodeListForEach($dropdowns, function ($dropdown) {
    initDropdown($dropdown)
  })
}

exports.initAll = initAll
