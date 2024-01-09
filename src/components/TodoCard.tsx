/** @format */

import React, { useRef, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { useTodoContext } from '../hooks/useTodoContext';

export type TodoCardProps = {
  id: string;
  completed: boolean;
  value: string;
  index: number;
  onDragStart: (e: React.DragEvent<HTMLFormElement>, index: number) => void;
  onDragEnter: (e: React.DragEvent<HTMLFormElement>, index: number) => void;
  onDragEnd: (e: React.DragEvent<HTMLFormElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLFormElement>) => void;
};

export default function TodoCard({
  id,
  completed,
  value,
  index,
  onDragStart,
  onDragEnd,
  onDragEnter,
  onDragOver,
}: TodoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  const { editTodo, deleteTodo, toggleComplete } = useTodoContext();

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
    <form
      className='todo-card'
      onSubmit={handleEdit}
      key={id}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnd={onDragEnd}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragOver={onDragOver}
    >
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
          <label htmlFor={`${id}`} className='todo-label'>
            {value}
          </label>
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
          disabled={completed}
          onClick={() => {
            setIsEditing(true);
          }}
        >
          <MdEdit />
        </button>
        <button className='delete' type='button' onClick={() => deleteTodo(id)}>
          X
        </button>
      </div>
    </form>
  );
}
