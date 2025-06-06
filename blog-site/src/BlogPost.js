import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {Link, useParams } from "react-router-dom";

function BlogPost({ blogs }) {
  const { id } = useParams();
  const post = blogs.find((blog) => blog.id.toString() === id);

  if (!post) {
    return <p>Post not found!</p>;
  }

  return (
    <div className="container">
      <div className="card my-4">
        <div className="card-body">
          <h1 className="card-title">{post.title}</h1>
          <p className="text-muted small">
            Published on: {new Date(post.date).toLocaleDateString()}
          </p>
          <ReactMarkdown rehypePlugins={[rehypeRaw]} >{post.content}</ReactMarkdown>
          <Link to="/" >
            <i class="bi bs-primary fs-4 bi-arrow-left"> Back</i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BlogPost