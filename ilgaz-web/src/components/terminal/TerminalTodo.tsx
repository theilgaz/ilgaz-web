import { useEffect, useRef } from 'react'
import {
  useTodoStore,
  splitText,
  formatTr,
  UNTAGGED,
} from '../../hooks/useTodoStore'

export function TerminalTodo() {
  const s = useTodoStore()
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (s.editingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [s.editingId])

  return (
    <div className="term-todo">
      <div className="term-block">
        <span className="term-prompt">&gt; cat ~/todo/{s.currentKey}</span>
      </div>

      <div className="term-todo-nav">
        <button
          type="button"
          className="term-todo-btn"
          onClick={s.goPrev}
          aria-label="Önceki gün"
        >[‹]</button>
        <span className="term-todo-date">{formatTr(s.currentKey)}</span>
        <span className="term-todo-count">
          {s.todos.length === 0 ? '—' : `${s.doneCount}/${s.todos.length}`}
        </span>
        {!s.isToday && (
          <button
            type="button"
            className="term-todo-btn"
            onClick={s.goToday}
          >[bugün]</button>
        )}
        <button
          type="button"
          className="term-todo-btn"
          onClick={s.toggleHideDone}
          aria-pressed={s.hideDone}
        >{s.hideDone ? '[+done]' : '[-done]'}</button>
        <button
          type="button"
          className="term-todo-btn"
          onClick={s.goNext}
          aria-label="Sonraki gün"
        >[›]</button>
      </div>

      <div className="term-todo-body">
        {s.visible.length === 0 && (
          <div className="term-todo-empty">
            {s.todos.length === 0
              ? '  (no entries — type below to add)'
              : '  (done items hidden)'}
          </div>
        )}
        {s.groups.map(group => {
          const isGroupDragging = s.dragGroup === group.tag
          const isGroupDropTarget = s.dropGroup === group.tag
          const headClass = [
            'term-todo-group-head',
            isGroupDragging ? 'is-dragging' : '',
            isGroupDropTarget ? (s.dropGroupBefore ? 'is-drop-before' : 'is-drop-after') : '',
          ].filter(Boolean).join(' ')
          return (
            <div className="term-todo-group" key={group.tag}>
              <div
                className={headClass}
                draggable
                onDragStart={e => s.onGroupDragStart(e, group.tag)}
                onDragOver={e => s.onGroupDragOver(e, group.tag)}
                onDrop={e => s.onGroupDrop(e, group.tag)}
                onDragEnd={s.onGroupDragEnd}
              >
                [{group.tag === UNTAGGED ? 'etiketsiz' : group.tag}]
              </div>
              <ul className="term-todo-list">
                {group.items.map(todo => {
                  const isDragging = s.dragId === todo.id
                  const isDropTarget = s.dropId === todo.id
                  const rowClass = [
                    'term-todo-row',
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
                        className="term-todo-grip"
                        aria-hidden="true"
                        draggable={s.editingId !== todo.id}
                        onDragStart={e => s.onRowDragStart(e, todo.id)}
                        onDragEnd={s.onRowDragEnd}
                      >::</span>
                      <button
                        type="button"
                        className="term-todo-checkbox"
                        onClick={() => s.toggle(todo.id)}
                        aria-checked={todo.done}
                        role="checkbox"
                      >[{todo.done ? 'x' : ' '}]</button>
                      {s.editingId === todo.id ? (
                        <input
                          ref={editInputRef}
                          className="term-todo-edit"
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
                            className="term-todo-text"
                            onDoubleClick={() => s.startEdit(todo)}
                          >
                            {clean}
                            {tags.map((t, i) => (
                              <span key={i} className="term-todo-tag"> [{t}]</span>
                            ))}
                          </span>
                        )
                      })()}
                      <button
                        type="button"
                        className="term-todo-remove"
                        onClick={() => s.remove(todo.id)}
                        aria-label="Sil"
                      >[x]</button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="term-todo-add-row">
        <span className="term-prompt">&gt; </span>
        <input
          className="term-todo-add"
          placeholder="yeni iş... (#etiket ile grupla)"
          value={s.draft}
          onChange={e => s.setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') s.addTodo() }}
          aria-label="Yeni iş ekle"
        />
        <span className="term-cursor">█</span>
      </div>
    </div>
  )
}
