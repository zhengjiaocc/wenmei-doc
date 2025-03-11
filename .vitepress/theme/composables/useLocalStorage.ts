import { ref } from 'vue'

interface ReaderSettings {
  fontSize: number
  backgroundColor: string
  pageTurningMode: string
}

export function useLocalStorage() {
  const fontSize = ref(16)
  const backgroundColor = ref('color-white')
  const pageTurningMode = ref('horizontal')

  const saveSettings = (settings: ReaderSettings) => {
    localStorage.setItem('readerSettings', JSON.stringify(settings))
  }

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('readerSettings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      fontSize.value = settings.fontSize
      backgroundColor.value = settings.backgroundColor
      pageTurningMode.value = settings.pageTurningMode
    }
  }

  const saveProgress = (chapterId: string) => {
    localStorage.setItem('readingProgress', JSON.stringify({ chapterId }))
  }

  const loadProgress = (): string | null => {
    const savedProgress = localStorage.getItem('readingProgress')
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      return progress.chapterId
    }
    return null
  }

  return {
    fontSize,
    backgroundColor,
    pageTurningMode,
    saveSettings,
    loadSettings,
    saveProgress,
    loadProgress
  }
} 