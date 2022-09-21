import { throttle } from 'throttle-debounce'
import 'whatwg-fetch'

const isVisible = elem => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length )

const scheduleItems = document.querySelectorAll('.section-schedule__item')
if (scheduleItems.length) {
  let maxWidth = 0
  scheduleItems.forEach(item => {
    if (item.offsetWidth > maxWidth) {
      maxWidth = item.offsetWidth
    }
  })
  scheduleItems.forEach(item => {
    item.style.width = `${maxWidth}px`
  })
}

const accordions = document.querySelectorAll('[data-accordion]')
if (accordions.length) {
  accordions.forEach(accordion => {
    const rows = accordion.querySelectorAll('[data-accordion-row]') || []

    rows.forEach(row => {
      const header = row.querySelector('[data-accordion-header]')
      const content = row.querySelector('[data-accordion-content]')

      const toggle = () => {
        if (content.style.maxHeight) {
          header.classList.remove('_active')
          content.classList.remove('_active')
          content.style.maxHeight = null
        } else {
          header.classList.add('_active')
          content.classList.add('_active')
          content.style.maxHeight = content.scrollHeight + 'px'
        }
      }

      header.addEventListener('click', toggle)
    })
  })
}

const modalToggles = document.querySelectorAll('[data-modal-toggle]')
if (modalToggles.length) {
  modalToggles.forEach(toggle => {
    let modal = document.querySelector(toggle.dataset.modalToggle)
    let close = modal.querySelector('[data-modal-close]')
    const outsideClickListener = event => {
      if (!modal.contains(event.target) && isVisible(modal) && !toggle.contains(event.target)) {
        hide()
        removeClickListener()
      }
    }
    const removeClickListener = () => {
      document.removeEventListener('click', outsideClickListener)
    }
    const show = () => {
      modal.classList.add('_opened')
      document.addEventListener('click', outsideClickListener)
    }
    const hide = () => {
      modal.classList.remove('_opened')
    }
    toggle.addEventListener('click', e => {
      e.preventDefault()
      show()
    })
    close.addEventListener('click', e => {
      e.preventDefault()
      hide()
    })
  })
}

const header = document.querySelector('.header')
const scrollup = document.querySelector('.ui-scrollup')
const scrollHandler = throttle(10, () => {
  if (window.pageYOffset > 20) {
    header.classList.add('header_fixed')
  } else {
    header.classList.remove('header_fixed')
  }

  if (window.pageYOffset > 400) {
    scrollup.classList.add('ui-scrollup_fixed')
  } else {
    scrollup.classList.remove('ui-scrollup_fixed')
  }
})

window.addEventListener('scroll', scrollHandler)

const scrolls = document.querySelectorAll('[data-scroll]') || []
scrolls.forEach(scroll => scroll.addEventListener('click', e => {
  e.preventDefault()

  let offset = document.querySelector('.header').offsetHeight
  let top = 0
  let left = 0
  if (scroll.dataset.scroll) {
    let target = document.querySelector(scroll.dataset.scroll)
    if (target) {
      top = target.offsetTop - offset
    }
  }

  window.scroll({
    top,
    left,
    behavior: 'smooth'
  })
}))

const menuToggle = document.querySelector('.header__toggle')
const menuList = document.querySelector('.header__menu')
menuToggle.addEventListener('click', () => {
  if (menuList.classList.contains('_active')) {
    menuList.classList.remove('_active')
  } else {
    menuList.classList.add('_active')
  }
  if (menuToggle.classList.contains('_active')) {
    menuToggle.classList.remove('_active')
  } else {
    menuToggle.classList.add('_active')
  }
})

const removeFocusableListener = () => {
  document.querySelector('body').classList.remove('page-focusable')
  document.removeEventListener('click', removeFocusableListener)
}

document.addEventListener('keyup', function (e) {
  if (e.keyCode === 9) {
    document.querySelector('body').classList.add('page-focusable')
    document.addEventListener('click', removeFocusableListener)
  }
}, false)

const forms = document.querySelectorAll('[data-from]') || []
forms.forEach(form => {
  const messagesContainer = form.querySelector('[data-from-messages]') || form

  let messages = new Set()

  const showMessage = (text, mode, delay) => {
    const el = document.createElement('div')
    el.classList.add('ui-form-message')
    el.classList.add('ui-form-message_' + mode)
    el.innerHTML = text
    const close = document.createElement('button')
    close.classList.add('ui-form-message__close')
    close.addEventListener('click', e => {
      e.stopPropagation()
      messages.delete(el)
      el.parentNode.removeChild(el)
    })
    el.appendChild(close)
    messagesContainer.appendChild(el)

    messages.add(el)

    if (delay) {
      setTimeout(() => {
        messages.delete(el)
        el.parentNode.removeChild(el)
      }, delay)
    }
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault()

    for (let message of messages) {
      messages.delete(message)
      message.parentNode.removeChild(message)
    }

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form)
    })
    .then(response => response.json())
    .then(response => {
      if (response.success) {
        form.reset()
        showMessage('Сообщение успешно отправлено', 'success', 8000)
      } else {
        showMessage('В форме присутствуют ошибки', 'error')
      }
    })
  })
})
