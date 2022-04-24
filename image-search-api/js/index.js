const containerImgs = document.querySelector('#grid')
const searchField = document.querySelector('#input')
const searchBtn = document.querySelector('.search__button')
const clearBtn = document.querySelector('.clear__button')
let lazyImages = document.querySelectorAll('img[data-src]')
const windowHeight = document.documentElement.clientHeight
const data = {
	searchField: 'fractal',
}

// changing the theme value of images
function changeUrl() {
	return `https://api.unsplash.com/search/photos?query=${data.searchField}&per_page=30&orientation=landscape&w=1080&client_id=2lEtsiM3623vpCR6b9iYCF9mH2J93Ua1s9ed10Tk__E`
}

function urlUpdate(param) {
	if (searchField.value.length > 0) {
		clearBtn.classList.add('active')
		data.searchField = searchField.value
		setLocalStorage()
		let url = changeUrl()
		getData(url)
	} else {
		let url = changeUrl()
		getData(url)
	}
}

function clearField(param) {
	searchField.value = ''
	clearBtn.classList.remove('active')
}

async function getData(url) {
	const res = await fetch(url)
	const result = await res.json()

	if (result.results.length > 0) {
		addImgBlock(result.results)
		lazyImages = document.querySelectorAll('img[data-src]')
		lazyImagesPushArray()
	} else {
		console.log('403 - Too many request')
	}
}

// Add received images to DOM
function addImgBlock(arrAPI) {
	containerImgs.innerHTML = ''

	arrAPI.forEach(post => {
		let urlRegular = post.urls.regular
		const blockImg = document.createElement('div')
		const imgAPI = document.createElement('img')
		imgAPI.classList.add('lazyload', 'loading-img')
		imgAPI.setAttribute('data-src', `${urlRegular}`)
		imgAPI.setAttribute('src', `./assets/img/loading-default.png`)
		blockImg.classList.add('img__api')

		blockImg.append(imgAPI)
		containerImgs.append(blockImg)
	})
}

function setLocalStorage() {
	localStorage.setItem('imageApi-param', JSON.stringify(data))
}

// load from local storage
function loadFromLocalStorage() {
	const localData = JSON.parse(localStorage.getItem('imageApi-param'))

	if (localData) {
		for (const key in localData) {
			if (data.hasOwnProperty(key)) {
				data[key] = localData[key]
			}
		}
	}
}

// lazy Loading Images
let lazyImagesPositions = []
function lazyImagesPushArray() {
	lazyImagesPositions = []
	if (lazyImages.length > 0) {
		lazyImages.forEach(img => {
			if (img.dataset.src) {
				lazyImagesPositions.push(img.getBoundingClientRect().top + scrollY)

				lazyScrollCheck()
			}
		})
	}
}
function lazyScroll() {
	if (lazyImages.length > 0) {
		lazyScrollCheck()
	}
}

function lazyScrollCheck() {
	var imgIndex = lazyImagesPositions.findIndex(
		item => scrollY > item - windowHeight
	)

	if (imgIndex >= 0) {
		if (lazyImages[imgIndex].dataset.src) {
			lazyImages[imgIndex].src = lazyImages[imgIndex].dataset.src
			lazyImages[imgIndex].removeAttribute('data-src')
		}
		delete lazyImagesPositions[imgIndex]
	}
}

// popup change
function popupImage(elem) {
	const target = elem.target
	if (target.classList.contains('loading-img')) {
		tooglePopup(target)
	}
}

function tooglePopup(target) {
	let url = ''
	if (target.hasAttribute('src')) {
		url = target.getAttribute('src')
	}

	let popupBg = document.querySelector('.popup__bg')
	let popup = document.querySelector('.popup')
	let openPopupButtons = document.querySelectorAll('.open-popup')
	let closePopupButton = document.querySelector('.close-popup')
	let bodyPopup = document.querySelector('.body-popup')

	popupBg.classList.add('active')
	popup.classList.add('active')

	if (url) {
		bodyPopup.innerHTML = ''
		const blockPopup = document.createElement('div')
		const imgPopup = document.createElement('img')
		imgPopup.src = url
		imgPopup.classList.add('imgPopup')
		blockPopup.append(imgPopup)
		bodyPopup.append(blockPopup)
	}

	if (closePopupButton) {
		closePopupButton.addEventListener('click', () => {
			popupBg.classList.remove('active')
			popup.classList.remove('active')
		})
	}

	document.addEventListener('click', e => {
		if (e.target === popupBg) {
			popupBg.classList.remove('active')
			popup.classList.remove('active')
		}
	})
}

document.addEventListener('click', popupImage.bind(this))
window.addEventListener('scroll', lazyScroll)
window.addEventListener('DOMContentLoaded', function (e) {
	loadFromLocalStorage()

	// focus setting
	searchField.focus()

	// default loading
	let url = changeUrl()
	getData(url)

	// download on request api
	searchBtn.addEventListener('click', urlUpdate.bind(this))
	clearBtn.addEventListener('click', clearField.bind(this))

	// send by pressing the Enter key
	searchField.addEventListener('keyup', function (event) {
		event.preventDefault()
		if (event.keyCode === 13) {
			urlUpdate(event)
		}
	})
})
