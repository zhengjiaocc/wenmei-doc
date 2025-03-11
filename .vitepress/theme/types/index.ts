export interface Chapter {
  id: string
  chapterTitle: string
  chapterContent: string
  additionalInfo?: string
}

export interface ReaderSettings {
  fontSize: number
  backgroundColor: string
  pageTurningMode: string
} 