import { useEffect, useRef } from 'react'
import {
  useTodoStore,
  splitText,
  formatTr,
  UNTAGGED,
} from '../../hooks/useTodoStore'

export function WinXPTodo() {
  const s = useTodoStore()
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (s.editingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [s.editingId])

  return (
    <div className="xp-todo">
      <div className="xp-todo-nav">
        <button type="button" className="xp-link-btn xp-todo-arrow" onClick={s.goPrev} aria-label="Önceki gün">‹</button>
        <span className="xp-todo-date">{formatTr(s.currentKey)}</span>
        <span className="xp-todo-count">
          {s.todos.length === 0 ? '—' : `${s.doneCount}/${s.todos.length}`}
        </span>
        {!s.isToday && (
          <button type="button" className="xp-link-btn" onClick={s.goToday}>Bugün</button>
        )}
        <button type="button" className="xp-link-btn" onClick={s.toggleHideDone} aria-pressed={s.hideDone}>
          {s.hideDone ? 'Tümü' : 'Gizle'}
        </button>
        <button type="button" className="xp-link-btn xp-todo-arrow" onClick={s.goNext} aria-label="Sonraki gün">›</button>
      </div>

      <div className="xp-todo-list">
        {s.visible.length === 0 && (
          <div className="xp-todo-empty">
            {s.todos.length === 0 ? '(görev yok — aşağıdan ekle)' : '(tamamlananlar gizli)'}
          </div>
        )}
        {s.groups.map(group => {
          const isGroupDragging = s.dragGroup === group.tag
          const isGroupDropTarget = s.dropGroup === group.tag
          const headClass = [
            'xp-todo-group-head',
            isGroupDragging ? 'is-dragging' : '',
            isGroupDropTarget ? (s.dropGroupBefore ? 'is-drop-before' : 'is-drop-after') : '',
          ].filter(Boolean).join(' ')
          const groupLabel = group.tag === UNTAGGED ? 'Etiketsiz' : group.tag
          return (
            <div className="xp-todo-group" key={group.tag}>
              <div
                className={headClass}
                draggable
                onDragStart={e => s.onGroupDragStart(e, group.tag)}
                onDragOver={e => s.onGroupDragOver(e, group.tag)}
                onDrop={e => s.onGroupDrop(e, group.tag)}
                onDragEnd={s.onGroupDragEnd}
              >
                {groupLabel}
              </div>
              <ul className="xp-todo-rows">
                {group.items.map(todo => {
                  const isDragging = s.dragId === todo.id
                  const isDropTarget = s.dropId === todo.id
                  const rowClass = [
                    'xp-todo-row',
                    todo.done ? 'is-done' : '',
                    isDragging ? 'is-dragging' : '',
                    isDropTarget ? (s.dropBefore ? 'is-drop-before' : 'is-drop-after') : '',
                  ].filter(Boolean).join(' ')
                  return (
                    <li
                      key={todo.id}
                      data-todo-row
                      className={rowClass}
                      onDragOver={e => s.onRowDragOver(e, todo.id)}
                      onDrop={e => s.onRowDrop(e, todo.id)}
                    >
                      <span
                        className="xp-todo-grip"
                        aria-hidden="true"
                        draggable={s.editingId !== todo.id}
                        onDragStart={e => s.onRowDragStart(e, todo.id)}
                        onDragEnd={s.onRowDragEnd}
                      >⋮⋮</span>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={todo.done}
                        className="xp-todo-check"
                        onClick={() => s.toggle(todo.id)}
                      >{todo.done ? '✓' : ''}</button>
                      {s.editingId === todo.id ? (
                        <input
                          ref={editInputRef}
                          className="xp-todo-edit-input"
                          value={s.editingText}
                          onChange={e => s.setEditingText(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') s.commitEdit()
                            else if (e.key === 'Escape') s.cancelEdit()
                          }}
                          onBlur={s.commitEdit}
                        />
                      ) : (() => {
                        const { clean, tags } = splitText(todo.text)
                        return (
                          <span
                            className="xp-todo-text"
                            onDoubleClick={() => s.startEdit(todo)}
                          >
                            {clean && <span className="xp-todo-body">{clean}</span>}
                            {tags.length > 0 && (
                              <span className="xp-todo-tags">
                                {tags.map((tag, i) => (
                                  <span key={i} className="xp-todo-tag">{tag}</span>
                                ))}
                              </span>
                            )}
                          </span>
                        )
                      })()}
                      <button
                        type="button"
                        className="xp-todo-remove"
                        onClick={() => s.remove(todo.id)}
                        aria-label="Sil"
                      >×</button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="xp-todo-add">
        <input
          className="xp-todo-input"
          placeholder="Yeni iş... (#etiket ile grupla)"
          value={s.draft}
          onChange={e => s.setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') s.addTodo() }}
          aria-label="Yeni iş ekle"
        />
        <button type="button" className="xp-link-btn xp-todo-add-btn" onClick={s.addTodo}>Ekle</button>
      </div>
    </div>
  )
}
