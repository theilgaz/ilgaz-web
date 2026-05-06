import { useEffect, useMemo, useState } from 'react'

export type Todo = {
  id: string
  text: string
  done: boolean
  createdAt: number
}

type Store = Record<string, Todo[]>

const STORAGE_KEY = 'ilgaz-todos-v1'
const HIDE_DONE_KEY = 'ilgaz-todos-hide-done'

const TR_DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
const TR_MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']

export const TAG_RE = /#[\p{L}\p{N}_-]+/gu
export const UNTAGGED = '·'

function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveStore(s: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

export function dateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parseKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function shiftDay(key: string, delta: number): string {
  const d = parseKey(key)
  d.setDate(d.getDate() + delta)
  return dateKey(d)
}

export function formatTr(key: string): string {
  const d = parseKey(key)
  return `${TR_DAYS[d.getDay()]} · ${d.getDate()} ${TR_MONTHS[d.getMonth()]}`
}

export function splitText(text: string): { clean: string; tags: string[] } {
  const tags: string[] = []
  const clean = text
    .replace(TAG_RE, m => { tags.push(m); return '' })
    .replace(/\s+/g, ' ')
    .trim()
  return { clean, tags }
}

export function firstTagOf(t: Todo): string {
  return t.text.match(TAG_RE)?.[0] ?? UNTAGGED
}

export type TodoGroup = { tag: string; items: Todo[] }

export function useTodoStore() {
  const today = useMemo(() => dateKey(new Date()), [])
  const [currentKey, setCurrentKey] = useState<string>(today)
  const [store, setStore] = useState<Store>(() => loadStore())
  const [hideDone, setHideDone] = useState<boolean>(() => {
    return localStorage.getItem(HIDE_DONE_KEY) === '1'
  })
  const [draft, setDraft] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  // Drag state — rows
  const [dragId, setDragId] = useState<string | null>(null)
  const [dropId, setDropId] = useState<string | null>(null)
  const [dropBefore, setDropBefore] = useState<boolean>(false)

  // Drag state — groups
  const [dragGroup, setDragGroup] = useState<string | null>(null)
  const [dropGroup, setDropGroup] = useState<string | null>(null)
  const [dropGroupBefore, setDropGroupBefore] = useState<boolean>(false)

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setStore(loadStore())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const todos = store[currentKey] ?? []
  const visible = hideDone ? todos.filter(t => !t.done) : todos
  const doneCount = todos.filter(t => t.done).length
  const isToday = currentKey === today

  const groups = useMemo<TodoGroup[]>(() => {
    const map = new Map<string, Todo[]>()
    const order: string[] = []
    for (const t of visible) {
      const first = firstTagOf(t)
      if (!map.has(first)) {
        map.set(first, [])
        order.push(first)
      }
      map.get(first)!.push(t)
    }
    return order.map(tag => ({ tag, items: map.get(tag)! }))
  }, [visible])

  const mutate = (next: Todo[]) => {
    const nextStore: Store = { ...store }
    if (next.length === 0) delete nextStore[currentKey]
    else nextStore[currentKey] = next
    setStore(nextStore)
    saveStore(nextStore)
  }

  const addTodo = () => {
    const text = draft.trim()
    if (!text) return
    const todo: Todo = {
      id: crypto.randomUUID(),
      text,
      done: false,
      createdAt: Date.now(),
    }
    mutate([...todos, todo])
    setDraft('')
  }

  const toggle = (id: string) => {
    mutate(todos.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const remove = (id: string) => {
    mutate(todos.filter(t => t.id !== id))
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditingText(todo.text)
  }

  const commitEdit = () => {
    if (!editingId) return
    const text = editingText.trim()
    if (!text) {
      remove(editingId)
    } else {
      mutate(todos.map(t => t.id === editingId ? { ...t, text } : t))
    }
    setEditingId(null)
    setEditingText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  const toggleHideDone = () => {
    const next = !hideDone
    setHideDone(next)
    localStorage.setItem(HIDE_DONE_KEY, next ? '1' : '0')
  }

  const goPrev = () => setCurrentKey(shiftDay(currentKey, -1))
  const goNext = () => setCurrentKey(shiftDay(currentKey, 1))
  const goToday = () => setCurrentKey(today)

  // Reorder rows
  const reorder = (sourceId: string, targetId: string, before: boolean) => {
    if (sourceId === targetId) return
    const sourceIdx = todos.findIndex(t => t.id === sourceId)
    if (sourceIdx === -1) return
    const next = [...todos]
    const [moved] = next.splice(sourceIdx, 1)
    const targetIdx = next.findIndex(t => t.id === targetId)
    if (targetIdx === -1) return
    next.splice(before ? targetIdx : targetIdx + 1, 0, moved)
    mutate(next)
  }

  const reorderGroups = (sourceTag: string, targetTag: string, before: boolean) => {
    if (sourceTag === targetTag) return
    const sourceItems = todos.filter(t => firstTagOf(t) === sourceTag)
    const others = todos.filter(t => firstTagOf(t) !== sourceTag)
    const firstTargetIdx = others.findIndex(t => firstTagOf(t) === targetTag)
    if (firstTargetIdx === -1) return
    let lastTargetIdx = firstTargetIdx
    for (let i = firstTargetIdx + 1; i < others.length; i++) {
      if (firstTagOf(others[i]) === targetTag) lastTargetIdx = i
    }
    const insertAt = before ? firstTargetIdx : lastTargetIdx + 1
    const next = [...others.slice(0, insertAt), ...sourceItems, ...others.slice(insertAt)]
    mutate(next)
  }

  // Row drag handlers
  const onRowDragStart = (e: React.DragEvent, id: string) => {
    setDragId(id)
    e.dataTransfer.effectAllowed = 'move'
    const parentLi = (e.currentTarget as HTMLElement).closest('[data-todo-row]')
    if (parentLi) {
      const rect = (parentLi as HTMLElement).getBoundingClientRect()
      try {
        e.dataTransfer.setDragImage(parentLi as Element, e.clientX - rect.left, e.clientY - rect.top)
      } catch { /* noop */ }
    }
    try { e.dataTransfer.setData('text/plain', id) } catch { /* Safari */ }
  }

  const onRowDragOver = (e: React.DragEvent, id: string) => {
    if (!dragId || id === dragId) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const before = e.clientY < rect.top + rect.height / 2
    if (dropId !== id) setDropId(id)
    if (dropBefore !== before) setDropBefore(before)
  }

  const onRowDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (dragId) reorder(dragId, targetId, dropBefore)
    setDragId(null)
    setDropId(null)
  }

  const onRowDragEnd = () => {
    setDragId(null)
    setDropId(null)
  }

  // Group drag handlers
  const onGroupDragStart = (e: React.DragEvent, tag: string) => {
    setDragGroup(tag)
    e.dataTransfer.effectAllowed = 'move'
    try { e.dataTransfer.setData('text/plain', tag) } catch { /* Safari */ }
  }

  const onGroupDragOver = (e: React.DragEvent, tag: string) => {
    if (!dragGroup || tag === dragGroup) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const before = e.clientY < rect.top + rect.height / 2
    if (dropGroup !== tag) setDropGroup(tag)
    if (dropGroupBefore !== before) setDropGroupBefore(before)
  }

  const onGroupDrop = (e: React.DragEvent, tag: string) => {
    e.preventDefault()
    if (dragGroup) reorderGroups(dragGroup, tag, dropGroupBefore)
    setDragGroup(null)
    setDropGroup(null)
  }

  const onGroupDragEnd = () => {
    setDragGroup(null)
    setDropGroup(null)
  }

  return {
    // state
    today,
    currentKey,
    todos,
    visible,
    groups,
    doneCount,
    isToday,
    hideDone,
    editingId,
    editingText,
    draft,

    // setters / actions
    setEditingText,
    setDraft,
    addTodo,
    toggle,
    remove,
    startEdit,
    commitEdit,
    cancelEdit,
    toggleHideDone,

    // day nav
    goPrev,
    goNext,
    goToday,

    // drag — rows
    dragId,
    dropId,
    dropBefore,
    onRowDragStart,
    onRowDragOver,
    onRowDrop,
    onRowDragEnd,

    // drag — groups
    dragGroup,
    dropGroup,
    dropGroupBefore,
    onGroupDragStart,
    onGroupDragOver,
    onGroupDrop,
    onGroupDragEnd,
  }
}
