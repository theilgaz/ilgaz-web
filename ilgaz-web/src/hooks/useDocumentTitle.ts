import { useEffect } from 'react'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title ? `${title} · ilg.az` : 'ilg.az'
    return () => {
      document.title = prevTitle
    }
  }, [title])
}
