import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import './App.css';

function App() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("/blogs.json")
      .then((res) => res.json())
      .then((data) =>{ 
        setTimeout(()=>{

        setBlogs(data);
        },2000
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
                          <div className="card h-100 shadow-sm">
                            <div className="card-body d-flex flex-column">
                              <h2 className="card-title h5">{post.title}</h2>
                              <p className="text-muted small mb-2">
                                Published on: {new Date(post.date).toLocaleDateString()}
                              </p>
                              <p className="card-text flex-grow-1">{post.summary}</p>
                              <Link
                                to={`/post/${post.id}`}
                                className="btn btn-primary mt-auto align-self-start"
                              >
                                Read More
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
          <p className="card-text">{post.content}</p>
          <Link to="/" className="btn btn-secondary">
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;