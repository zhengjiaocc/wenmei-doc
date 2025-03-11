import { ref } from 'vue'

export function useSwipeGesture() {
  const startX = ref(0)
  const startY = ref(0)

  const handleTouchStart = (event: TouchEvent) => {
    startX.value = event.touches[0].clientX
    startY.value = event.touches[0].clientY
  }

  const handleTouchEnd = (event: TouchEvent) => {
    const endX = event.changedTouches[0].clientX
    const endY = event.changedTouches[0].clientY
    const diffX = endX - startX.value
    const diffY = endY - startY.value

    return {
      diffX,
      diffY,
      isHorizontalSwipe: Math.abs(diffX) > 60 && Math.abs(diffY) < 50,
      direction: diffX > 0 ? 'right' : 'left'
    }
  }

  return {
    startX,
    startY,
    handleTouchStart,
    handleTouchEnd
  }
} 