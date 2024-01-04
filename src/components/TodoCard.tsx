/** @format */

import { useRef, useState } from 'react';
import { MdEdit } from 'react-icons/md';

export type TodoCardProps = {
  id: string;
  completed: boolean;
  value: string;
  toggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  editTodo: (id: string, newValue: string) => void;
};

export default function TodoCard({
  id,
  completed,
  value,
  onDelete,
  toggleComplete,
  editTodo,
}: TodoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  function handleEdit(e: React.FormEvent) {
    const editValue = editRef.current?.value;
    e.preventDefault();

    if (editValue) {
      editTodo(id, editValue);
    }
    if (editRef.current) editRef.current.value = ''; // reset

    setIsEditing(false);
  }

  return (
    <form className='todo-card' onSubmit={handleEdit} key={id}>
      {!isEditing ? (
        <div
          className='todo-content'
          style={
            completed
              ? { textDecoration: 'line-through' }
              : { textDecoration: 'none' }
          }
        >
          <input
            type='checkbox'
            id={`${id}`}
            defaultChecked={completed}
            onChange={() => toggleComplete(id)}
          />
          <label htmlFor={`${id}`}>{value}</label>
        </div>
      ) : (
        <div className='todo-edit'>
          <input
            type='text'
            id={`${id}`}
            ref={editRef}
            className='todo-edit-input'
          />
          <button
            className='cancel'
            type='button'
            onClick={() => setIsEditing(false)}
          >
            X
          </button>
        </div>
      )}

      <div className='todo-button'>
        <button
          className='edit'
          type='button'
          onClick={() => {
            setIsEditing(true);
          }}
        >
          <MdEdit />
        </button>
        <button className='delete' type='button' onClick={() => onDelete(id)}>
          X
        </button>
      </div>
    </form>
  );
}
