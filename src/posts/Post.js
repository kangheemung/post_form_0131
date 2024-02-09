import { useParams } from 'react-router-dom';

export default function Post({ todos }) {
  let { postId } = useParams();
  // Find the todo that matches the postId (assumes postId can be used to find todo)
  const todo = todos?.find(todo => `blog-post-${todo.id}` === postId);

  if (!todo) {
    // Handle the case where the todo is not found
    return <div>Post not found</div>;
  }

  // Render your post content using 'todo' object
  return (
    <div>
      {/* Example usage: */}
      <h2>{todo.title}</h2>
      <p>{todo.content}</p>
      {/* Add more post details as needed */}
    </div>
  );
}
