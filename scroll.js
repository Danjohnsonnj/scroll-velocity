function throttle(fn, delay) {
  let lastCall = 0
  return function (...args) {
    const now = performance.now()
    if (now - lastCall < delay) {
      return
    }
    lastCall = now
    return fn(...args)
  }
} 

const getVelocity = function(curr, prev) {
  const diffTime = curr.time - prev.time
  const diffPx = curr.px - prev.px
  return diffPx * 1000 / diffTime
}

const isMaxVelocity = function(curr, prev) {
  const mark = getVelocity(curr, prev)
  velocity.prev = velocity.curr
  velocity.curr = mark
  if (Math.abs(velocity.curr) <= Math.abs(velocity.prev)) {
    return velocity.prev
  }
  return false

}

// =====================

let scrollTimeout = null

const scrollPos = {
  prev: {
    px: 0,
    time: null,
  },
  curr: {
    px: 0,
    time: null,
  }
}

const velocity = {
  prev: 0,
  curr: 0,
  max: null,
}

const viewer = document.querySelector('.viewer')
for (let i = 0; i < 20; i++) {
  viewer.appendChild(document.createElement('hr'))
}

const onScrollEnd = () => {
  velocity.prev = 0
  velocity.curr = 0
  velocity.max = 0

  scrollPos.prev = {
    px: 0,
    time: null,
  }
  scrollPos.curr = {
    px: 0,
    time: null,
  }
}

const reportScrollDiff = endDelay => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
    scrollTimeout = null
  }
  scrollTimeout = setTimeout(onScrollEnd, endDelay)

  if (velocity.max) {
    return
  }
  const now = performance.now()
  scrollPos.prev = scrollPos.curr
  scrollPos.curr = {
    px: document.scrollingElement.scrollTop,
    time: now,
  }
  velocity.max = isMaxVelocity(scrollPos.curr, scrollPos.prev,)
  if (velocity.max) {
    console.log(`${velocity.max} px/s`)
  }
}

window.addEventListener('scroll', reportScrollDiff.bind(this, 50))