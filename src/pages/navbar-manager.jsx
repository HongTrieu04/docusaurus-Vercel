import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './navbar-manager.module.css';

export default function AdminPage() {
  const [navbars, setNavbars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    label: '',
    position: 'left',
    type: 'docSidebar',
    order: 0,
  });

  useEffect(() => {
    loadNavbars();
  }, []);

  const loadNavbars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/navbars');
      if (response.ok) {
        const data = await response.json();
        setNavbars(data);
      }
    } catch (err) {
      setError('Failed to load navbars: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddNavbar = async (e) => {
    e.preventDefault();
    if (!formData.id.trim() || !formData.label.trim()) {
      setError('ID and Label are required');
      return;
    }

    // Check if ID is valid (alphanumeric and hyphens only)
    if (!/^[a-z0-9-]+$/.test(formData.id)) {
      setError('ID must be lowercase, alphanumeric, and hyphens only (e.g., "my-guides")');
      return;
    }

    if (navbars.some(n => n.id === formData.id) && !editingId) {
      setError('This navbar ID already exists');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/navbars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: formData.id,
          label: formData.label,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create navbar');
      }

      const result = await response.json();
      setSuccess(`✅ Navbar "${formData.label}" created! Folder: /${formData.id}/`);
      setFormData({
        id: '',
        label: '',
        position: 'left',
        type: 'docSidebar',
        order: 0,
      });
      setEditingId(null);
      
      // Reload navbar list
      await loadNavbars();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create navbar');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (navbar) => {
    setFormData(navbar);
    setEditingId(navbar.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure? This will delete the /${id}/ folder and all its content.`)) {
      return;
    }

    try {
      setError(null);
      const response = await fetch('/api/navbars', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to delete navbar');
      }

      setSuccess(`✅ Navbar "${id}" deleted!`);
      setEditingId(null);
      await loadNavbars();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete navbar');
    }
  };

  const handleCancel = () => {
    setFormData({
      id: '',
      label: '',
      position: 'left',
      type: 'docSidebar',
      order: 0,
    });
    setEditingId(null);
    setError(null);
  };

  if (loading && navbars.length === 0) {
    return (
      <Layout title="Admin - Configure Navbars">
        <div className={styles.container}>
          <p>Loading navbars...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin - Configure Navbars">
      <div className={styles.container}>
        <Heading as="h1">📊 Navbar Management</Heading>
        
        {error && (
          <div className={styles.error}>
            ⚠️ {error}
          </div>
        )}
        
        {success && (
          <div className={styles.success}>
            {success}
          </div>
        )}

        <div className={styles.adminContent}>
          {/* Form Section */}
          <div className={styles.formSection}>
            <Heading as="h2">
              {editingId ? `Edit Navbar: ${editingId}` : 'Create New Navbar'}
            </Heading>

            <form onSubmit={handleAddNavbar} className={styles.adminForm}>
              <div className={styles.formGroup}>
                <label htmlFor="id">Folder ID *</label>
                <input
                  id="id"
                  type="text"
                  placeholder="e.g., guides"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase() })}
                  disabled={editingId !== null}
                  className={styles.formInput}
                  required
                />
                <small>Folder name in your project (lowercase, hyphens ok)</small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="label">Display Label *</label>
                <input
                  id="label"
                  type="text"
                  placeholder="e.g., Guides"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className={styles.formInput}
                  required
                />
                <small>How this appears in the navbar</small>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="type">Type</label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className={styles.formInput}
                  >
                    <option value="docSidebar">Documentation (docSidebar)</option>
                    <option value="doc">Single Doc</option>
                    <option value="link">External Link</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="position">Position</label>
                  <select
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className={styles.formInput}
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="order">Order</label>
                  <input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className={styles.formInput}
                  />
                  <small>Lower = appears first</small>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Processing...' : editingId ? 'Update' : 'Create'} Navbar
                </button>
                {editingId && (
                  <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List Section */}
          <div className={styles.listSection}>
            <Heading as="h2">Your Navbars ({navbars.length})</Heading>

            {navbars.length === 0 ? (
              <p className={styles.emptyMsg}>No navbars yet. Create your first one!</p>
            ) : (
              <div className={styles.navbarsList}>
                {navbars
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((navbar) => (
                    <div key={navbar.id} className={styles.navbarCard}>
                      <div className={styles.navbarCardHeader}>
                        <div>
                          <h3>{navbar.label}</h3>
                          <p className={styles.navbarId}>
                            📁 <code>/{navbar.id}/</code>
                          </p>
                        </div>
                        <div className={styles.badges}>
                          <span className={styles.badge}>{navbar.type}</span>
                          <span className={styles.badge}>{navbar.position}</span>
                        </div>
                      </div>
                      <div className={styles.navbarCardActions}>
                        {!['docs', 'blog'].includes(navbar.id) && (
                          <>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => handleDelete(navbar.id)}
                              disabled={loading}
                            >
                              🗑️ Delete
                            </button>
                          </>
                        )}
                        {['docs', 'blog'].includes(navbar.id) && (
                          <span className={styles.lockedBadge}>🔒 Built-in</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className={styles.infoSection}>
            <Heading as="h3">ℹ️ How It Works</Heading>
            <div className={styles.info}>
              <ol>
                <li>
                  <strong>Fill the form</strong> with Folder ID (lowercase) and Display Label
                </li>
                <li>
                  <strong>Click "Create Navbar"</strong> to automatically create the folder
                </li>
                <li>
                  <strong>GitHub updates</strong> with the new folder (auto-commit by Vercel)
                </li>
                <li>
                  <strong>Vercel rebuilds</strong> and your navbar item appears on the site ✅
                </li>
                <li>
                  <strong>Add content</strong> using Decap CMS editor at <code>/admin</code>
                </li>
              </ol>

              <div className={styles.stepByStep}>
                <strong>Example:</strong>
                <ul>
                  <li>ID: <code>guides</code></li>
                  <li>Label: <code>Guides</code></li>
                  <li>Click "Create Navbar"</li>
                  <li>✅ New <code>/guides/</code> folder created</li>
                  <li>✅ <code>guides/intro.md</code> created automatically</li>
                  <li>✅ Navbar item "Guides" appears on site</li>
                  <li>✅ Edit pages via Decap CMS</li>
                </ul>
              </div>

              <p className={styles.tip}>
                💡 <strong>No Manual Steps!</strong> Everything happens automatically:
                <ul>
                  <li>✅ Folder created on your server</li>
                  <li>✅ GitHub updated via Vercel</li>
                  <li>✅ Navbar config auto-updated</li>
                  <li>✅ Site rebuilds and deploys</li>
                </ul>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
