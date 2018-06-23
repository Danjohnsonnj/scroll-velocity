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

const velocity = function (curr, prev) {
  const diffTime = curr.time - prev.time
  const diffPx = curr.px - prev.px
  return `${diffPx * 1000 / diffTime} px/s`
}

// =====================

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

const viewer = document.querySelector('.viewer')
for (let i = 0; i < 20; i++) {
  viewer.appendChild(document.createElement('hr'))
}

const reportScrollDiff = () => {
  const now = performance.now()
  scrollPos.prev = scrollPos.curr
  scrollPos.curr = {
    px: document.scrollingElement.scrollTop,
    time: now,
  }
  console.log(velocity(scrollPos.curr, scrollPos.prev))
}

window.addEventListener('scroll', throttle(reportScrollDiff, 10))