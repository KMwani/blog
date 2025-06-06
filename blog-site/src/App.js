import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BlogPost from "./BlogPost";
import './App.css';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [searchItem, setSearchItem] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4); // Number of posts per page

  useEffect(() => {
    fetch("/blogs.json")
      .then((res) => res.json())
      .then((data) => {
        setTimeout(() => {
          setBlogs(data);
          setFilteredBlogs(data); // Initialize filteredBlogs with all blogs
        }, 500);
      })
      .catch((error) => console.error("Error loading blogs:", error));
  }, []);

  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    setSearchItem(term);
    const filtered = blogs.filter((blog) => {
      return blog.summary.toLowerCase().includes(term) || blog.content.toLowerCase().includes(term);
    });
    setFilteredBlogs(filtered);
    setCurrentPage(1); // Reset to first page on new search
  }

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredBlogs.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Router>
      <div className="App">
        <div className="app container py-4">
          <header className="app-header mb-5 text-center">
            <h1 className="display-4">My Blog</h1>
            <p className="lead text-muted">Sharing thoughts and ideas</p>
          </header>

          <main className="app-main">
            <div className="d-flex justify-content-end mb-3">
              <input
                className="form-control p-2 rounded border border-2 w-auto"
                type="search"
                value={searchItem}
                placeholder="Search Blogs"
                aria-label="Search"
                onChange={handleSearch}
              />
            </div>

            <Routes>
              <Route
                path="/"
                element={
                  <section className="blog-list row g-4">
                    {currentPosts.length === 0 && filteredBlogs.length === 0 ? (
                      <p>Loading blog posts...</p>
                    ) : currentPosts.length === 0 && filteredBlogs.length > 0 ? (
                      <p>No blog posts found matching your search.</p>
                    ) : (
                      currentPosts.map((post) => (
                        <article key={post.id} className="blog-post col-md-6">
                          <div className="card blog-list-card h-100 shadow-sm">
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
                                <i className="bi bs-primary fs-4 bi-arrow-right"></i>
                              </Link>
                            </div>
                          </div>
                        </article>
                      ))
                    )}

                    {/* Pagination */}
                    {filteredBlogs.length > postsPerPage && (
                      <nav aria-label="Page navigation" className="mt-4">
                        <ul className="pagination justify-content-center">
                          {pageNumbers.map(number => (
                            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                              <button onClick={() => paginate(number)} className="page-link">
                                {number}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </nav>
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

export default App;