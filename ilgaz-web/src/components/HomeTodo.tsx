import { useEffect, useRef } from 'react'
import {
  useTodoStore,
  splitText,
  formatTr,
  UNTAGGED,
} from '../hooks/useTodoStore'

export function HomeTodo() {
  const s = useTodoStore()
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (s.editingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [s.editingId])

  return (
    <section className="section wrap" id="todo">
      <div className="section-head">
        <div className="idx">§ 02 Bugün</div>
        <div>
          <h2>Bugünü <em>kapatmak</em>.</h2>
          <div className="sub">Küçük bir günlük liste. Her şey tarayıcında kalır.</div>
        </div>
      </div>

      <div className="todo-panel">
        <div className="todo-nav">
          <button
            type="button"
            className="todo-nav-btn"
            onClick={s.goPrev}
            aria-label="Önceki gün"
          >‹</button>
          <div className="todo-nav-date">{formatTr(s.currentKey)}</div>
          <div className="todo-nav-spacer" />
          <div className="todo-count">
            {s.todos.length === 0 ? '—' : `${s.doneCount} / ${s.todos.length}`}
          </div>
          {!s.isToday && (
            <button
              type="button"
              className="todo-today-btn"
              onClick={s.goToday}
            >bugüne dön</button>
          )}
          <button
            type="button"
            className="todo-hide-btn"
            onClick={s.toggleHideDone}
            aria-pressed={s.hideDone}
            title={s.hideDone ? 'Tamamlananları göster' : 'Tamamlananları gizle'}
          >{s.hideDone ? 'tümü' : 'gizle'}</button>
          <button
            type="button"
            className="todo-nav-btn"
            onClick={s.goNext}
            aria-label="Sonraki gün"
          >›</button>
        </div>

        <div className="todo-list">
          {s.visible.length === 0 && (
            <div className="todo-empty">
              {s.todos.length === 0
                ? 'Bu gün için bir şey yok. Bir tane ekle.'
                : 'Tamamlananlar gizli.'}
            </div>
          )}
          {s.groups.map(group => {
            const isGroupDragging = s.dragGroup === group.tag
            const isGroupDropTarget = s.dropGroup === group.tag
            const headClass = [
              'todo-group-head',
              group.tag === UNTAGGED ? 'is-untagged' : '',
              isGroupDragging ? 'is-dragging' : '',
              isGroupDropTarget ? (s.dropGroupBefore ? 'is-drop-before' : 'is-drop-after') : '',
            ].filter(Boolean).join(' ')
            return (
              <div className="todo-group-cell" key={group.tag}>
                <div
                  className={headClass}
                  draggable
                  onDragStart={e => s.onGroupDragStart(e, group.tag)}
                  onDragOver={e => s.onGroupDragOver(e, group.tag)}
                  onDrop={e => s.onGroupDrop(e, group.tag)}
                  onDragEnd={s.onGroupDragEnd}
                >
                  {group.tag === UNTAGGED ? 'etiketsiz' : group.tag}
                </div>
                <ul className="todo-group">
                  {group.items.map(todo => {
                    const isDragging = s.dragId === todo.id
                    const isDropTarget = s.dropId === todo.id
                    const rowClass = [
                      'todo-row',
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
                          className="todo-grip"
                          aria-hidden="true"
                          draggable={s.editingId !== todo.id}
                          onDragStart={e => s.onRowDragStart(e, todo.id)}
                          onDragEnd={s.onRowDragEnd}
                        >⋮⋮</span>
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={todo.done}
                          className="todo-checkbox"
                          onClick={() => s.toggle(todo.id)}
                        >{todo.done ? '☑' : '☐'}</button>
                        {s.editingId === todo.id ? (
                          <input
                            ref={editInputRef}
                            className="todo-edit-input"
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
                            <div
                              className="todo-text"
                              onDoubleClick={() => s.startEdit(todo)}
                            >
                              {clean && <span className="todo-body">{clean}</span>}
                              {tags.length > 0 && (
                                <span className="todo-tags">
                                  {tags.map((tag, i) => (
                                    <span key={i} className="todo-tag">{tag}</span>
                                  ))}
                                </span>
                              )}
                            </div>
                          )
                        })()}
                        <button
                          type="button"
                          className="todo-remove"
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
          <div className="todo-row todo-add">
            <span className="todo-checkbox is-add">+</span>
            <input
              className="todo-add-input"
              placeholder="Yeni iş…  (#etiket ile grupla)"
              value={s.draft}
              onChange={e => s.setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') s.addTodo() }}
              aria-label="Yeni iş ekle"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
