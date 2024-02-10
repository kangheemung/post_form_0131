import React from 'react';
import { useParams } from 'react-router-dom';

export default function Post({ todos, completeTodo }) {
  let { postId } = useParams();
  const todo = todos?.find(todo => `blog-post-${todo.id}` === postId);

  if (!todo) {
    return <div>Post not found</div>;
  }

  return (
    <div style={{ textDecoration: todo.isCompleted ? 'line-through' : '' }} className="todo">
      <h2>{todo.title}</h2>
      <p>{todo.content}</p>

      {/* Form for creating a post */}
      <form >
        <input type="text" name="title" placeholder="Title" />
        <textarea name="content" placeholder="Content"></textarea>
        <button type="submit">Create Post</button>
      </form>

      <button onClick={() => completeTodo(todo.id)}>Complete</button>
    </div>
  );
}
