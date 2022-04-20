const containerImgs = document.querySelector('#grid')
const searchField = document.querySelector('#input')
const searchBtn = document.querySelector('.search__button')
const clearBtn = document.querySelector('.clear__button')

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

	console.log(result)
	if (result.results.length > 0) {
		addImgBlock(result.results)
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
		blockImg.classList.add('img')
		blockImg.setAttribute('data-url', `${urlRegular}`)
		blockImg.style.backgroundImage = `url(${urlRegular})`
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
