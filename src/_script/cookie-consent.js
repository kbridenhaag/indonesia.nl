const { getCookie, setCookie } = require('./set-cookie')

function initCookieConsent ($module) {
  if (!$module) return

  const cookieConsentApproved = getCookie('cookie-confirmed')
  const cookieConsentRejected = getCookie('cookie-rejection-confirmed')
  const cookieConsentConfirmation = document.querySelector(
    '#cookie-consent-confirmation'
  )
  const hideCookieConfirmationBtn = document.getElementById('hide-cookie-consent-confirmation-btn')

  if (cookieConsentConfirmation && cookieConsentRejected && cookieConsentRejected === 'false') {
    cookieConsentConfirmation.style.display = 'block'
    setCookie('cookie-rejection-confirmed', 'true')

    const message = document.getElementById('cookie-consent-confirmation-rejected')

    if (message) {
      message.style.display = 'block'
    }

    if (hideCookieConfirmationBtn) {
      hideCookieConfirmationBtn.addEventListener('click', function (e) {
        e.preventDefault()
        cookieConsentConfirmation.style.display = 'none'
      })
    }

    return
  }

  if (cookieConsentConfirmation && cookieConsentApproved && cookieConsentApproved === 'false') {
    cookieConsentConfirmation.style.display = 'block'
    setCookie('cookie-confirmed', 'true')

    const message = document.getElementById('cookie-consent-confirmation-accepted')

    if (message) {
      message.style.display = 'block'
    }

    if (hideCookieConfirmationBtn) {
      hideCookieConfirmationBtn.addEventListener('click', function (e) {
        e.preventDefault()
        cookieConsentConfirmation.style.display = 'none'
      })
    }

    return
  }

  const cookieName =
    $module.getAttribute('cookie-name') || 'seen_cookie_message'
  if (!getCookie(cookieName)) {
    $module.style.display = 'block'
  }

  const rejectCookiesBtn = document.getElementById('reject-cookies-btn')

  if (rejectCookiesBtn) {
    rejectCookiesBtn.addEventListener('click', rejectCookieConsent)
  }

  function rejectCookieConsent (e) {
    e.preventDefault()
    setCookie(cookieName, 1, 30)
    setCookie('cookie-rejection-confirmed', 'false')
    location.reload()
    return false
  }

  const acceptCookiesBtn = document.getElementById('accept-cookies-btn')

  if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', setCookieConsent)
  }

  function setCookieConsent (e) {
    e.preventDefault()
    // eslint-disable-next-line no-undef
    _paq.push(['rememberCookieConsentGiven'])
    setCookie(cookieName, 1, 30)
    setCookie('cookie-confirmed', 'false')
    location.reload()
    return false
  }
}

module.exports = initCookieConsent
