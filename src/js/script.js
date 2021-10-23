@@include('_DynamicAdapt.js')
@@include('_supportWebp.js')


if (window.innerWidth <= 475) {
  document.addEventListener('click', e => {
    if (!e.target.closest('.header__lens') && !e.target.closest('.header__search')) {
      document.querySelector('.header__search').style.cssText = 'opacity: 0; visibility: hidden;'
    } else {
      document.querySelector('.header__search').style.cssText = 'opacity: 1; visibility: visible;'
    }
  })
}


// Бургер-меню
const body = document.querySelector('body')
const burger = document.querySelector('.burger')
const burgerContent = document.querySelector('.burger-content')

burger.addEventListener('click', e => {
  e.preventDefault()

	burger.classList.toggle('active')
	burgerContent.classList.toggle('active')
	body.classList.toggle('lock')
})


// Всплывающие окна
const popupLinks = document.querySelectorAll('.popup__link')
const lockPadding = document.querySelectorAll('.lock-padding')
const timeout = 800
let unlock = true

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index]
		popupLink.addEventListener('click', function(e) {
			const popupName = popupLink.getAttribute('data-popup')
			const currentPopup = document.getElementById(popupName)
      
			popupOpen(currentPopup)
			e.preventDefault()
		})
	}
}

const popupCloseIcon = document.querySelectorAll('.close__popup')

if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index]
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup'))
			e.preventDefault()
		})
	}
}

function popupOpen(currentPopup) {
	if (currentPopup && unlock) {
    const popupActive = document.querySelector('.popup.open')

    if (popupActive) {
      popupClose(popupActive, false)
    } else {
      bodyLock()
    }

    currentPopup.classList.add('open')
    currentPopup.addEventListener('click', function (e) {
      if (!e.target.closest('.popup__content')) {
        popupClose(e.target.closest('.popup'))
      }
    })
	}
}

function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open')

		if (doUnlock) {
			bodyUnLock()
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('body').offsetWidth + 'px'

	for (let index = 0; index < lockPadding.length; index++) {
		const el = lockPadding[index]
		el.style.paddingRight = lockPaddingValue
	}

	body.style.paddingRight = lockPaddingValue
	body.classList.add('lock')
	unlock = false

	setTimeout(function() {
		unlock = true
	},  timeout)
}

function bodyUnLock() {
	setTimeout(function() {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index]
			el.style.paddingRight = '0px'
		}

		body.style.paddingRight = '0px'
		body.classList.remove('lock')
	},  timeout)

	unlock = false

	setTimeout(function() {
		unlock = true
	},  timeout)
}


// Слайдер
new Swiper('.services__slider', {
  navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev', 
	},
  grabCursor: true,
  keyboard: {
		enabled: true,
		onlyInViewport: true,
		pageUpDown: true,
	},
  loop: true,
  spaceBetween: 30,
  breakpoints: {
    1000: {
      slidesPerView: '4',
      slidesPerGroup: 4,
    },
    800: {
      slidesPerView: '3',
      slidesPerGroup: 3,
    },
    500: {
      slidesPerView: '2',
      slidesPerGroup: 2,
    },
  }
})


//Табы
const switches = document.querySelectorAll('.projects__switch')
const menu = document.querySelectorAll('.projects__menu')

switches.forEach((item) =>
	item.addEventListener('click', (e) => {
		const id = e.target.getAttribute('href').replace('#', '')
    
		switches.forEach((child) => child.classList.remove('active'))
		menu.forEach((child) => child.classList.remove('active-tab'))

		item.classList.add('active')
		document.getElementById(id).classList.add('active-tab')

		e.preventDefault()
	})
)

if (switches.length > 0) switches[0].click()


// Валидация формы
document.querySelectorAll('.form__button').forEach(button => {
  button.addEventListener('click', e => {
  e.preventDefault()
    document.querySelectorAll('.form__valid input').forEach(el => {
      const regExp = /^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i

      if (el.value === "") {
        el.parentElement.setAttribute('data-error', 'Заполните поле')
      } else if (el.getAttribute('type') === 'email' && !regExp.test(el.value)) {
        el.parentElement.setAttribute('data-error', 'Проверьте правильность email')
      } else {
        el.parentElement.removeAttribute('data-error')
      }
    })
  })
})


// Маска ввода номера телефона
const telNubers = document.querySelectorAll('input[type="tel"]')
const mask = new Inputmask('+7 (999) 999 99 99')

telNubers.forEach(el => mask.mask(el))