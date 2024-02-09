function PostsList({ todos, setTodos }) {

  // Function to handle the delete action
  const handleDelete = (postId) => {
    // Filter out the post with the matching id and update the todos state
    setTodos(todos.filter(post => post.id !== postId));
  };

  return (
    <div>
      <h2>Posts</h2>
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
