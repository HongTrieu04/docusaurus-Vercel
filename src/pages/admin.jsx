import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './admin.module.css';

export default function AdminPage() {
  const [navbars, setNavbars] = useState([]);
  const [selectedNavbar, setSelectedNavbar] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNavbarName, setNewNavbarName] = useState('');
  const [newPageName, setNewPageName] = useState('');
  const [showNavbarForm, setShowNavbarForm] = useState(false);
  const [showPageForm, setShowPageForm] = useState(false);

  // Fetch navbars list
  useEffect(() => {
    fetchNavbars();
  }, []);

  const fetchNavbars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/navbars');
      if (!response.ok) throw new Error('Failed to fetch navbars');
      const data = await response.json();
      setNavbars(data);
      if (data.length > 0) {
        setSelectedNavbar(data[0].id);
        fetchPages(data[0].id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async (navbarId) => {
    try {
      const response = await fetch(`/api/navbars/${navbarId}/pages`);
      if (!response.ok) throw new Error('Failed to fetch pages');
      const data = await response.json();
      setPages(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectNavbar = (navbarId) => {
    setSelectedNavbar(navbarId);
    fetchPages(navbarId);
  };

  const handleAddNavbar = async (e) => {
    e.preventDefault();
    if (!newNavbarName.trim()) return;

    try {
      const response = await fetch('/api/navbars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newNavbarName }),
      });
      if (!response.ok) throw new Error('Failed to create navbar');
      
      setNewNavbarName('');
      setShowNavbarForm(false);
      await fetchNavbars();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteNavbar = async (navbarId) => {
    if (!window.confirm('Are you sure you want to delete this navbar?')) return;

    try {
      const response = await fetch(`/api/navbars/${navbarId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete navbar');
      
      await fetchNavbars();
      setSelectedNavbar(null);
      setPages([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddPage = async (e) => {
    e.preventDefault();
    if (!newPageName.trim() || !selectedNavbar) return;

    try {
      const response = await fetch(`/api/navbars/${selectedNavbar}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newPageName }),
      });
      if (!response.ok) throw new Error('Failed to create page');
      
      setNewPageName('');
      setShowPageForm(false);
      await fetchPages(selectedNavbar);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePage = async (pageId) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;

    try {
      const response = await fetch(`/api/navbars/${selectedNavbar}/pages/${pageId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete page');
      
      await fetchPages(selectedNavbar);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditPage = (pageId) => {
    // Redirect to Decap CMS editor or your custom editor
    window.location.href = `/admin#/edit/${selectedNavbar}/${pageId}`;
  };

  if (loading) {
    return (
      <Layout title="Admin - Manage Navbars and Pages">
        <div className={styles.container}>
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin - Manage Navbars and Pages">
      <div className={styles.container}>
        <Heading as="h1">Admin Dashboard</Heading>
        
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.content}>
          {/* Navbars Section */}
          <div className={styles.navbarsSection}>
            <Heading as="h2">Navbars</Heading>
            
            <div className={styles.navbarsList}>
              {navbars.map((navbar) => (
                <div
                  key={navbar.id}
                  className={`${styles.navbarItem} ${
                    selectedNavbar === navbar.id ? styles.active : ''
                  }`}
                >
                  <button
                    className={styles.navbarButton}
                    onClick={() => handleSelectNavbar(navbar.id)}
                  >
                    {navbar.label}
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteNavbar(navbar.id)}
                    title="Delete navbar"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {showNavbarForm ? (
              <form onSubmit={handleAddNavbar} className={styles.form}>
                <input
                  type="text"
                  placeholder="Navbar name (e.g., tutorial)"
                  value={newNavbarName}
                  onChange={(e) => setNewNavbarName(e.target.value)}
                  className={styles.input}
                  autoFocus
                />
                <button type="submit" className={styles.submitBtn}>
                  Create
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowNavbarForm(false)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                className={styles.addBtn}
                onClick={() => setShowNavbarForm(true)}
              >
                + Add Navbar
              </button>
            )}
          </div>

          {/* Pages Section */}
          {selectedNavbar && (
            <div className={styles.pagesSection}>
              <Heading as="h2">
                Pages in {navbars.find((n) => n.id === selectedNavbar)?.label}
              </Heading>

              <div className={styles.pagesList}>
                {pages.length === 0 ? (
                  <p className={styles.emptyMsg}>No pages yet</p>
                ) : (
                  pages.map((page) => (
                    <div key={page.id} className={styles.pageItem}>
                      <div className={styles.pageInfo}>
                        <h3>{page.title}</h3>
                        <p className={styles.pageFile}>{page.file}</p>
                      </div>
                      <div className={styles.pageActions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEditPage(page.id)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDeletePage(page.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {showPageForm ? (
                <form onSubmit={handleAddPage} className={styles.form}>
                  <input
                    type="text"
                    placeholder="Page title"
                    value={newPageName}
                    onChange={(e) => setNewPageName(e.target.value)}
                    className={styles.input}
                    autoFocus
                  />
                  <button type="submit" className={styles.submitBtn}>
                    Create Page
                  </button>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setShowPageForm(false)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  className={styles.addBtn}
                  onClick={() => setShowPageForm(true)}
                >
                  + Add Page
                </button>
              )}
            </div>
          )}
        </div>

        <p className={styles.info}>
          💡 Use the <strong>Decap CMS Editor</strong> (at /admin) for full markdown editing.
          This dashboard is for quick management of navbars and pages.
        </p>
      </div>
    </Layout>
  );
}
