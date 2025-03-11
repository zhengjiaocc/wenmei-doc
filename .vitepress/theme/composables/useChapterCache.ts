import { ref } from 'vue'
import type { Chapter } from '../types'

export function useChapterCache() {
  const cache = ref<Record<string, Chapter>>({})
  const preloadQueue = ref<string[]>([]) // 预加载队列
  const isPreloading = ref(false)

  const addToCache = (id: string, chapter: Chapter) => {
    cache.value[id] = chapter
  }

  const getFromCache = (id: string): Chapter | null => {
    return cache.value[id] || null
  }

  const clearCache = () => {
    cache.value = {}
    preloadQueue.value = []
  }

  // 添加到预加载队列
  const addToPreloadQueue = (ids: string[]) => {
    // 过滤掉已经缓存的章节
    const newIds = ids.filter(id => !cache.value[id])
    preloadQueue.value = [...new Set([...preloadQueue.value, ...newIds])]
  }

  // 开始预加载
  const startPreload = async (getChapter: (id: string) => Promise<Chapter>) => {
    if (isPreloading.value || preloadQueue.value.length === 0) return

    isPreloading.value = true
    try {
      // 每次取出队列中的前两个章节进行预加载
      const idsToLoad = preloadQueue.value.slice(0, 2)
      preloadQueue.value = preloadQueue.value.slice(2)

      await Promise.all(
        idsToLoad.map(async id => {
          try {
            if (!cache.value[id]) {
              const chapter = await getChapter(id)
              addToCache(id, chapter)
            }
          } catch (error) {
            console.error(`预加载章节 ${id} 失败:`, error)
          }
        })
      )
    } finally {
      isPreloading.value = false
      // 如果队列中还有章节，继续预加载
      if (preloadQueue.value.length > 0) {
        setTimeout(() => startPreload(getChapter), 1000) // 延迟1秒后继续预加载
      }
    }
  }

  return {
    cache,
    addToCache,
    getFromCache,
    clearCache,
    addToPreloadQueue,
    startPreload
  }
} 