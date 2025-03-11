import { ref } from 'vue'

interface FullScreenDocument extends Document {
  webkitExitFullscreen?: () => Promise<void>
  msExitFullscreen?: () => Promise<void>
}

interface FullScreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>
  msRequestFullscreen?: () => Promise<void>
}

export function useFullscreen() {
  const isFullscreen = ref(false)

  const tryFullScreen = async () => {
    try {
      const elem = document.documentElement as FullScreenElement
      if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen()
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen()
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen()
        }
        isFullscreen.value = true
      }
    } catch (err) {
      console.error('全屏模式错误:', err)
    }
  }

  const exitFullScreen = async () => {
    try {
      const doc = document as FullScreenDocument
      if (document.fullscreenElement) {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen()
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen()
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen()
        }
        isFullscreen.value = false
      }
    } catch (err) {
      console.error('退出全屏模式错误:', err)
    }
  }

  const handleFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement
  }

  return {
    isFullscreen,
    tryFullScreen,
    exitFullScreen,
    handleFullscreenChange
  }
} 