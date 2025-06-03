import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import './App.css';

function App() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("/blogs.json")
      .then((res) => res.json())
      .then((data) =>{ 
        setTimeout(()=>{

        setBlogs(data);
        },500
      );})
      .catch((error) => console.error("Error loading blogs:", error));
  }, []);
  
    return (
    <Router>
      <div className="App">
        <div className="app container py-4">
          <header className="app-header mb-5 text-center">
            <h1 className="display-4">My Blog</h1>
            <p className="lead text-muted">Sharing thoughts and ideas</p>
          </header>

          <main className="app-main">
            <Routes>
              <Route
                path="/"
                element={
                  <section className="blog-list row g-4">
                    {blogs.length === 0 ? (
                      <p>Loading blog posts...</p>
                    ) : (
                      blogs.map((post) => (
                        <article key={post.id} className="blog-post col-md-6">
                          <div className="card blog-list-card h-100  shadow-sm" >
                            <div className="card-body d-flex flex-column">
                              <h2 className="card-title fw-bold h5">{post.title}</h2>
                              <p className="card-text text-center flex-grow-1">{post.summary}</p>
                              <p className="text-muted fst-italic text-start small mb-2">
                                Published on: {new Date(post.date).toLocaleDateString()}
                              </p>
                              <Link
                                to={`/post/${post.id}`}
                                className="mt-auto align-self-end"
                                hash="hash"
                              >
                                <i class="bi bs-primary fs-4 bi-arrow-right"></i>
                              </Link>
                            </div>
                          </div>
                        </article>
                      ))
                    )}
                  </section>
                }
              />
              <Route path="/post/:id" element={<BlogPost blogs={blogs} />} />
            </Routes>
          </main>

          <footer className="app-footer mt-5 text-center text-muted small">
            <p>&copy; 2025 My Blog. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

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

export default App;