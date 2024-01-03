/** @format */

export type TodoFormProps = {
  addTodo: (e: React.FormEvent) => void;
  todoRef: React.Ref<HTMLInputElement>;
};

export default function TodoForm({ addTodo, todoRef }: TodoFormProps) {
  return (
    <form onSubmit={addTodo} className='todo-form'>
      <input
        ref={todoRef}
        className='todo-input'
        type='text'
        placeholder='What need to be done?'
      />
    </form>
  );
}
