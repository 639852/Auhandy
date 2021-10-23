'use strict'

function DynamicAdapt (type) {
  this.type = type
}

DynamicAdapt.prototype.init = function () {
  const _this = this
  // массив объектов
  this.оbjects = []
  this.daClassname = '_dynamic_adapt_'
  // массив DOM-элементов
  this.nodes = document.querySelectorAll('[data-da]')

  // наполнение оbjects объктами
  for (let i = 0; i < this.nodes.length; i++) {
    const node = this.nodes[i]
    const data = node.dataset.da.trim()
    const dataArray = data.split(',')
    const оbject = {}
    оbject.element = node
    оbject.parent = node.parentNode
    оbject.destination = document.querySelector(dataArray[0].trim())
    оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767'
    оbject.place = dataArray[2] ? dataArray[2].trim() : 'last'
    оbject.index = this.indexInParent(оbject.parent, оbject.element)
    this.оbjects.push(оbject)
  }

  this.arraySort(this.оbjects)

  // массив уникальных медиа-запросов
  this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
    return '(' + this.type + '-width: ' + item.breakpoint + 'px),' + item.breakpoint
  }, this)
  this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
    return Array.prototype.indexOf.call(self, item) === index
  })

  // навешивание слушателя на медиа-запрос
  // и вызов обработчика при первом запуске
  for (let i = 0; i < this.mediaQueries.length; i++) {
    const media = this.mediaQueries[i]
    const mediaSplit = String.prototype.split.call(media, ',')
    const matchMedia = window.matchMedia(mediaSplit[0])
    const mediaBreakpoint = mediaSplit[1]

    // массив объектов с подходящим брейкпоинтом
    const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
      return item.breakpoint === mediaBreakpoint
    })
    matchMedia.addListener(function () {
      _this.mediaHandler(matchMedia, оbjectsFilter)
    })
    this.mediaHandler(matchMedia, оbjectsFilter)
  }
}

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
  if (matchMedia.matches) {
    for (let i = 0; i < оbjects.length; i++) {
      const оbject = оbjects[i]
      оbject.index = this.indexInParent(оbject.parent, оbject.element)
      this.moveTo(оbject.place, оbject.element, оbject.destination)
    }
  } else {
    for (let i = 0; i < оbjects.length; i++) {
      const оbject = оbjects[i]
      if (оbject.element.classList.contains(this.daClassname)) {
        this.moveBack(оbject.parent, оbject.element, оbject.index)
      }
    }
  }
}

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
  element.classList.add(this.daClassname)
  if (place === 'last' || place >= destination.children.length) {
    destination.insertAdjacentElement('beforeend', element)
    return
  }
  if (place === 'first') {
    destination.insertAdjacentElement('afterbegin', element)
    return
  }
  destination.children[place].insertAdjacentElement('beforebegin', element)
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
  element.classList.remove(this.daClassname)
  if (parent.children[index] !== undefined) {
    parent.children[index].insertAdjacentElement('beforebegin', element)
  } else {
    parent.insertAdjacentElement('beforeend', element)
  }
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
  const array = Array.prototype.slice.call(parent.children)
  return Array.prototype.indexOf.call(array, element)
}

// Функция сортировки массива по breakpoint и place
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
  if (this.type === 'min') {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0
        }

        if (a.place === 'first' || b.place === 'last') {
          return -1
        }

        if (a.place === 'last' || b.place === 'first') {
          return 1
        }

        return a.place - b.place
      }

      return a.breakpoint - b.breakpoint
    })
  } else {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0
        }

        if (a.place === 'first' || b.place === 'last') {
          return 1
        }

        if (a.place === 'last' || b.place === 'first') {
          return -1
        }

        return b.place - a.place
      }

      return b.breakpoint - a.breakpoint
    })
  }
}

const da = new DynamicAdapt('max')
da.init()

function testWebP (callback) {
  const webP = new Image()
  webP.onload = webP.onerror = function () {
    callback(webP.height == 2)
  }
  webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
}

testWebP(function (support) {
  if (support == true) {
    document.querySelector('body').classList.add('webp')
  } else {
    document.querySelector('body').classList.add('no-webp')
  }
})



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