import React, { useState } from 'react';

function PostsList({ todos, setTodos, addTodo }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    addTodo({
      id: Date.now(), // Or another unique ID generator
      title: value,
      content: '' // If content is needed, consider adding another state and input field
    });
    setValue('');
  };

  const handleDelete = (postId) => {
    setTodos(todos.filter(post => post.id !== postId));
  };

  return (
    <div>
      <h2>Posts</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add new todo"
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}: {todo.content}</span>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostsList;
