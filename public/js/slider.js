const buttons = document.querySelectorAll('[data-slider-button]')
console.log('Slider buttons:', buttons)
const indicators = document.querySelectorAll(
  '[data-slider-indicator]'
)

changeSlideByNavigator()
changeSlideByIndicator()

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the first slide
  const slideList = document.querySelector('[data-slider-container]')
  const activeSlide = slideList.querySelector(
    '[data-slider-item-active]'
  )
  const firstSlide = slideList.children[0]
  if (activeSlide) delete activeSlide.dataset.sliderItemActive
  firstSlide.dataset.sliderItemActive = true
  // Initialize the first indicator
  const firstIndicator = document.querySelector(
    '[data-slider-indicator="0"]'
  )
  const activeIndicator = document.querySelector(
    '[data-slider-indicator-active]'
  )
  if (activeIndicator)
    delete activeIndicator.dataset.sliderIndicatorActive
  firstIndicator.dataset.sliderIndicatorActive = true
  changeSlideByAuto()
})

function changeSlideByAuto() {
  const slideList = document.querySelector('[data-slider-container]')
  setInterval(() => {
    // Update Slides
    const activeSlide = slideList.querySelector(
      '[data-slider-item-active]'
    )
    let nextIndex = [...slideList.children].indexOf(activeSlide) + 1
    if (nextIndex >= slideList.children.length) nextIndex = 0
    const newSlide = slideList.children[nextIndex]
    newSlide.dataset.sliderItemActive = true
    if (activeSlide) delete activeSlide.dataset.sliderItemActive
    // Update Indicators
    const activeIndicator = document.querySelector(
      '[data-slider-indicator-active]'
    )
    const nextIndicator = document.querySelector(
      `[data-slider-indicator='${nextIndex}']`
    )
    if (activeIndicator)
      delete activeIndicator.dataset.sliderIndicatorActive
    nextIndicator.dataset.sliderIndicatorActive = true
  }, 5000) // 5 seconds
}

function changeSlideByNavigator() {
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      console.log('button clicked')
      const slideList = document.querySelector(
        '[data-slider-container]'
      )
      const offset = button.dataset.sliderButton === 'next' ? 1 : -1
      // Update next slide
      const activeSlide = slideList.querySelector(
        '[data-slider-item-active]'
      )
      let newIndex =
        [...slideList.children].indexOf(activeSlide) + offset
      if (newIndex < 0) newIndex = slideList.children.length - 1
      if (newIndex >= slideList.children.length) newIndex = 0
      const newSlide = slideList.children[newIndex]

      newSlide.dataset.sliderItemActive = true
      if (activeSlide) delete activeSlide.dataset.sliderItemActive
      // Update indicators
      const nextIndicator = document.querySelector(
        `[data-slider-indicator='${newIndex}']`
      )
      const activeIndicator = document.querySelector(
        '[data-slider-indicator-active]'
      )
      nextIndicator.dataset.sliderIndicatorActive = true
      if (activeIndicator)
        delete activeIndicator.dataset.sliderIndicatorActive
    })
  })
}

function changeSlideByIndicator() {
  indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      const index = indicator.dataset.sliderIndicator
      const slideList = document.querySelector(
        '[data-slider-container]'
      )
      // Update Slides
      const activeSlide = slideList.querySelector(
        '[data-slider-item-active]'
      )
      const newSlide = slideList.children[index]

      if (activeSlide) delete activeSlide.dataset.sliderItemActive
      newSlide.dataset.sliderItemActive = true
      // Update Indicators
      const activeIndicator = document.querySelector(
        '[data-slider-indicator-active]'
      )
      const nextIndicator = document.querySelector(
        `[data-slider-indicator='${index}']`
      )
      if (activeIndicator)
        delete activeIndicator.dataset.sliderIndicatorActive
      nextIndicator.dataset.sliderIndicatorActive = true
    })
  })
}
