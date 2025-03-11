export function useFullscreen() {
  const tryFullScreen = async (element: HTMLElement | null) => {
    if (element?.requestFullscreen) {
      try {
        await element.requestFullscreen()
        console.log('自动进入全屏成功')
      } catch (error) {
        console.error('自动进入全屏失败:', error)
      }
    }
  }

  const exitFullScreen = async () => {
    if (document.exitFullscreen) {
      try {
        await document.exitFullscreen()
        console.log('退出全屏成功')
      } catch (error) {
        console.error('退出全屏失败:', error)
      }
    }
  }

  const handleFullscreenChange = () => {
    if (document.fullscreenElement) {
      console.log('当前全屏的元素:', document.fullscreenElement)
    } else {
      console.log('已退出全屏模式')
    }
  }

  return {
    tryFullScreen,
    exitFullScreen,
    handleFullscreenChange
  }
} 