import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './admin.module.css';

export default function AdminPage() {
  const [navbars, setNavbars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    label: '',
    position: 'left',
    type: 'docSidebar',
    order: 0,
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      // Load from navbars.config.json
      const response = await fetch('/navbars.config.json');
      if (response.ok) {
        const data = await response.json();
        setNavbars(data.navbars || []);
      } else {
        setNavbars([]);
      }
    } catch (err) {
      console.log('No existing config, starting fresh');
      setNavbars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNavbar = (e) => {
    e.preventDefault();
    if (!formData.id.trim() || !formData.label.trim()) {
      setError('ID and Label are required');
      return;
    }

    if (navbars.some(n => n.id === formData.id) && !editingId) {
      setError('This navbar ID already exists');
      return;
    }

    if (editingId) {
      // Update existing
      setNavbars(navbars.map(n => 
        n.id === editingId ? { ...formData } : n
      ));
      setEditingId(null);
    } else {
      // Add new
      setNavbars([...navbars, { ...formData }]);
    }

    setFormData({
      id: '',
      label: '',
      position: 'left',
      type: 'docSidebar',
      order: 0,
    });
    setError(null);
  };

  const handleEdit = (navbar) => {
    setFormData(navbar);
    setEditingId(navbar.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure? This will remove the navbar from the navigation.')) {
      setNavbars(navbars.filter(n => n.id !== id));
      setEditingId(null);
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

  const handleSaveConfig = async () => {
    try {
      const configContent = `export const navbarsConfig = ${JSON.stringify({ navbars }, null, 2)};`;
      
      // Show instructions instead of actually saving
      alert(`Configuration ready to save:\n\n${configContent}\n\nCopy this to a new file or update your docusaurus.config.js navbar.items array`);
    } catch (err) {
      setError('Failed to save configuration');
    }
  };

  if (loading) {
    return (
      <Layout title="Admin - Configure Navbars">
        <div className={styles.container}>
          <p>Loading configuration...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin - Configure Navbars">
      <div className={styles.container}>
        <Heading as="h1">📊 Navbar Configuration Admin</Heading>
        
        <div className={styles.adminContent}>
          {error && <div className={styles.error}>{error}</div>}

          {/* Form Section */}
          <div className={styles.formSection}>
            <Heading as="h2">
              {editingId ? `Edit Navbar: ${editingId}` : 'Add New Navbar Item'}
            </Heading>

            <form onSubmit={handleAddNavbar} className={styles.adminForm}>
              <div className={styles.formGroup}>
                <label htmlFor="id">Folder ID (e.g., guides, api, tutorial)</label>
                <input
                  id="id"
                  type="text"
                  placeholder="guides"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  disabled={editingId !== null}
                  className={styles.formInput}
                  required
                />
                <small>Folder name in your project root (e.g., /guides/, /api/)</small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="label">Display Label</label>
                <input
                  id="label"
                  type="text"
                  placeholder="Guides"
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
                <button type="submit" className={styles.submitBtn}>
                  {editingId ? 'Update' : 'Add'} Navbar
                </button>
                {editingId && (
                  <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List Section */}
          <div className={styles.listSection}>
            <Heading as="h2">Configured Navbars ({navbars.length})</Heading>

            {navbars.length === 0 ? (
              <p className={styles.emptyMsg}>No navbars configured yet. Add one using the form above.</p>
            ) : (
              <div className={styles.navbarsList}>
                {navbars
                  .sort((a, b) => a.order - b.order)
                  .map((navbar) => (
                    <div key={navbar.id} className={styles.navbarCard}>
                      <div className={styles.navbarCardHeader}>
                        <div>
                          <h3>{navbar.label}</h3>
                          <p className={styles.navbarId}>ID: <code>{navbar.id}</code></p>
                        </div>
                        <div className={styles.badges}>
                          <span className={styles.badge}>{navbar.type}</span>
                          <span className={styles.badge}>{navbar.position}</span>
                          <span className={styles.badge}>Order: {navbar.order}</span>
                        </div>
                      </div>
                      <div className={styles.navbarCardActions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(navbar)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(navbar.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className={styles.infoSection}>
            <Heading as="h3">ℹ️ How This Works</Heading>
            <div className={styles.info}>
              <ol>
                <li>
                  <strong>Create a folder</strong> in your project root like: <code>/guides/</code>, <code>/api/</code>, etc.
                </li>
                <li>
                  <strong>Add markdown files</strong> inside that folder (like you do in <code>/docs/</code>)
                </li>
                <li>
                  <strong>Configure here</strong> to make it appear as a navbar item
                </li>
                <li>
                  <strong>Update docusaurus.config.js</strong> with the configuration (copy the config below)
                </li>
              </ol>

              <div className={styles.configPreview}>
                <strong>Current Configuration (copy to navbar items in docusaurus.config.js):</strong>
                <pre><code>{JSON.stringify(navbars, null, 2)}</code></pre>
              </div>

              <p className={styles.tip}>
                💡 <strong>Note:</strong> You need to manually:
                <ul>
                  <li>Create folder: <code>mkdir -p /your-folder-name</code></li>
                  <li>Add pages: create <code>.md</code> files in that folder</li>
                  <li>Create sidebar config: add to <code>sidebars.js</code></li>
                  <li>Update docusaurus.config.js: paste the configuration above into navbar items</li>
                </ul>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
