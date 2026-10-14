import React, { useState, useEffect } from 'react';
import { api, getStoredToken, getStoredRole, getStoredUsername } from './services/api';
import {
  BookOpen,
  Users,
  Calendar,
  AlertTriangle,
  BarChart3,
  UserPlus,
  LogOut,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  FileText,
  Upload,
  Trash2,
  Edit,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [token, setToken] = useState(getStoredToken());
  const [role, setRole] = useState(getStoredRole());
  const [username, setUsername] = useState(getStoredUsername());
  const [activeTab, setActiveTab] = useState('books');

  // Login form state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Global feedback message
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  const showFeedback = (text, type = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback({ text: '', type: '' }), 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await api.login(loginUser, loginPass);
      setToken(res.access_token);
      setRole(res.role);
      setUsername(loginUser);
      showFeedback('Sesión iniciada correctamente');
    } catch (err) {
      setLoginError(err.message || 'Error de credenciales');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setToken(null);
    setRole(null);
    setUsername(null);
  };

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', padding: '20px' }}>
        <div className="card" style={{ maxWidth: '440px', width: '100%', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div className="logo-badge" style={{ margin: '0 auto 16px', width: '56px', height: '56px', fontSize: '1.6rem' }}>
              <BookOpen size={28} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Manager Library</h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '6px' }}>Plataforma integral de gestión bibliotecaria</p>
          </div>

          {loginError && (
            <div className="alert alert-danger">
              <AlertTriangle size={18} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Nombre de Usuario</label>
              <input
                className="form-input"
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                required
                placeholder="ej: admin o bibliotecario"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                className="form-input"
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '8px' }}
              disabled={loginLoading}
            >
              {loginLoading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-badge">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="sidebar-title">Manager Library</div>
            <div className="sidebar-sub">Ficha ADSO 3145555</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            <BookOpen size={18} /> Catálogo de Libros
          </button>
          <button
            className={`nav-item ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            <Users size={18} /> Socios
          </button>
          <button
            className={`nav-item ${activeTab === 'loans' ? 'active' : ''}`}
            onClick={() => setActiveTab('loans')}
          >
            <Calendar size={18} /> Préstamos
          </button>
          <button
            className={`nav-item ${activeTab === 'overdue' ? 'active' : ''}`}
            onClick={() => setActiveTab('overdue')}
          >
            <AlertTriangle size={18} /> Libros Vencidos
          </button>
          {role === 'admin' && (
            <>
              <button
                className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
                onClick={() => setActiveTab('reports')}
              >
                <BarChart3 size={18} /> Reporte Más Prestados
              </button>
              <button
                className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <UserPlus size={18} /> Crear Bibliotecario
              </button>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-badge">
            <span className="user-name">{username}</span>
            <span className="user-role">{role}</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout} title="Cerrar sesión">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="main-wrapper">
        <header className="top-navbar">
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>
            Panel de Operaciones &bull; {role === 'admin' ? 'Administrador' : 'Bibliotecario'}
          </div>
          <div>
            <span className="badge badge-copies">Sesión activa (8 hrs)</span>
          </div>
        </header>

        <main className="page-container">
          {feedback.text && (
            <div className={`alert ${feedback.type === 'error' ? 'alert-danger' : 'alert-success'}`}>
              {feedback.type === 'error' ? <XCircle size={18} /> : <CheckCircle size={18} />}
              <span>{feedback.text}</span>
            </div>
          )}

          {activeTab === 'books' && <BooksView role={role} showFeedback={showFeedback} />}
          {activeTab === 'members' && <MembersView role={role} showFeedback={showFeedback} />}
          {activeTab === 'loans' && <LoansView role={role} showFeedback={showFeedback} />}
          {activeTab === 'overdue' && <OverdueView showFeedback={showFeedback} />}
          {activeTab === 'reports' && role === 'admin' && <ReportsView showFeedback={showFeedback} />}
          {activeTab === 'users' && role === 'admin' && <UsersView showFeedback={showFeedback} />}
        </main>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 1. VISTA DE LIBROS (CATÁLOGO)
// ----------------------------------------------------
function BooksView({ role, showFeedback }) {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Modal create/edit
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedBook, setSelectedBook] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formIsbn, setFormIsbn] = useState('');
  const [formCatId, setFormCatId] = useState('');
  const [formTotal, setFormTotal] = useState(1);
  const [modalError, setModalError] = useState('');

  // Cover upload modal
  const [coverModalBook, setCoverModalBook] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories();
      setCategories(res);
      if (res.length > 0 && !formCatId) setFormCatId(res[0].id);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await api.getBooks({ q: search, category_id: selectedCat, page, size: 10 });
      setBooks(res.items || []);
      setTotal(res.total || 0);
    } catch (e) {
      showFeedback(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [search, selectedCat, page]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedBook(null);
    setFormTitle('');
    setFormAuthor('');
    setFormIsbn('');
    if (categories.length > 0) setFormCatId(categories[0].id);
    setFormTotal(1);
    setModalError('');
    setShowModal(true);
  };

  const handleOpenEdit = (b) => {
    setModalMode('edit');
    setSelectedBook(b);
    setFormTitle(b.title);
    setFormAuthor(b.author);
    setFormIsbn(b.isbn);
    setFormCatId(b.category?.id || '');
    setFormTotal(b.total_copies);
    setModalError('');
    setShowModal(true);
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    setModalError('');
    try {
      if (modalMode === 'create') {
        await api.createBook({
          title: formTitle,
          author: formAuthor,
          isbn: formIsbn,
          category_id: formCatId,
          total_copies: parseInt(formTotal, 10),
        });
        showFeedback('Libro creado exitosamente');
      } else {
        await api.updateBook(selectedBook.id, {
          title: formTitle,
          author: formAuthor,
          category_id: formCatId,
          total_copies: parseInt(formTotal, 10),
        });
        showFeedback('Libro actualizado exitosamente');
      }
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      setModalError(err.message);
    }
  };

  const handleDeleteBook = async (id, title) => {
    if (!window.confirm(`¿Dar de baja lógica el libro «${title}»?`)) return;
    try {
      await api.deleteBook(id);
      showFeedback('Libro dado de baja correctamente');
      fetchBooks();
    } catch (e) {
      showFeedback(e.message, 'error');
    }
  };

  const handleUploadCover = async (e) => {
    e.preventDefault();
    if (!coverFile) return;
    try {
      await api.uploadCover(coverModalBook.id, coverFile);
      showFeedback('Portada actualizada con éxito');
      setCoverModalBook(null);
      setCoverFile(null);
      fetchBooks();
    } catch (err) {
      showFeedback(err.message, 'error');
    }
  };

  const handleDeleteCover = async (id) => {
    if (!window.confirm('¿Eliminar la portada de este libro?')) return;
    try {
      await api.deleteCover(id);
      showFeedback('Portada eliminada');
      fetchBooks();
    } catch (err) {
      showFeedback(err.message, 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Catálogo de Libros</h1>
          <p className="page-desc">Consulta de títulos disponibles, inventario y gestión de catálogo</p>
        </div>
        {role === 'admin' && (
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={18} /> Nuevo Libro
          </button>
        )}
      </div>

      <div className="card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Buscar por título o autor..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div style={{ width: '220px' }}>
          <select
            className="form-select"
            value={selectedCat}
            onChange={(e) => { setSelectedCat(e.target.value); setPage(1); }}
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Portada</th>
              <th>Título y Autor</th>
              <th>ISBN</th>
              <th>Categoría</th>
              <th>Ejemplares</th>
              {role === 'admin' && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={role === 'admin' ? 6 : 5} style={{ textAlign: 'center', padding: '32px' }}>Cargando catálogo...</td></tr>
            ) : books.length === 0 ? (
              <tr><td colSpan={role === 'admin' ? 6 : 5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No se encontraron libros activos en el catálogo.</td></tr>
            ) : (
              books.map((b) => (
                <tr key={b.id}>
                  <td style={{ width: '60px' }}>
                    {b.cover_key ? (
                      <img
                        src={api.getCoverUrl(b.id)}
                        alt={b.title}
                        style={{ width: '40px', height: '56px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                      />
                    ) : (
                      <div style={{ width: '40px', height: '56px', background: '#f1f5f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <BookOpen size={16} />
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{b.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.author}</div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{b.isbn}</td>
                  <td>
                    <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>
                      {b.category?.name || 'General'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${b.available_copies > 0 ? 'badge-open' : 'badge-overdue'}`}>
                      {b.available_copies} disp. / {b.total_copies} tot.
                    </span>
                  </td>
                  {role === 'admin' && (
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(b)} title="Editar libro">
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setCoverModalBook(b)} title="Gestionar portada">
                          <Upload size={14} />
                        </button>
                        {b.cover_key && (
                          <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteCover(b.id)} title="Quitar portada">
                            <XCircle size={14} />
                          </button>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBook(b.id, b.title)} title="Baja lógica">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Mostrando {books.length} de {total} libros
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Anterior
          </button>
          <button className="btn btn-secondary btn-sm" disabled={page * 10 >= total} onClick={() => setPage(page + 1)}>
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal Libro (Crear / Editar) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {modalMode === 'create' ? 'Registrar Nuevo Libro' : 'Editar Información de Libro'}
              </h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}><XCircle size={18} /></button>
            </div>
            <form onSubmit={handleSaveBook}>
              <div className="modal-body">
                {modalError && (
                  <div className="alert alert-danger">
                    <AlertTriangle size={16} />
                    <span>{modalError}</span>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Título del Libro *</label>
                  <input className="form-input" required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Autor *</label>
                  <input className="form-input" required value={formAuthor} onChange={(e) => setFormAuthor(e.target.value)} />
                </div>
                {modalMode === 'create' && (
                  <div className="form-group">
                    <label className="form-label">ISBN (13 dígitos) *</label>
                    <input className="form-input" required maxLength={13} minLength={13} value={formIsbn} onChange={(e) => setFormIsbn(e.target.value)} placeholder="Ej: 9780307474728" />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Categoría *</label>
                  <select className="form-select" required value={formCatId} onChange={(e) => setFormCatId(e.target.value)}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Total de Ejemplares (≥ 1) *</label>
                  <input className="form-input" type="number" min={1} required value={formTotal} onChange={(e) => setFormTotal(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Portada */}
      {coverModalBook && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Subir Portada — {coverModalBook.title}</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setCoverModalBook(null)}><XCircle size={18} /></button>
            </div>
            <form onSubmit={handleUploadCover}>
              <div className="modal-body">
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
                  Formatos permitidos: JPEG o PNG. Tamaño máximo: 2 MB.
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  required
                  onChange={(e) => setCoverFile(e.target.files[0])}
                  className="form-input"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setCoverModalBook(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Subir Portada</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 2. VISTA DE SOCIOS
// ----------------------------------------------------
function MembersView({ role, showFeedback }) {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Create member modal
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [modalError, setModalError] = useState('');

  // Detail view modal
  const [detailMember, setDetailMember] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.getMembers({ q: search, page, size: 10 });
      setMembers(res.items || []);
      setTotal(res.total || 0);
    } catch (e) {
      showFeedback(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [search, page]);

  const handleCreateMember = async (e) => {
    e.preventDefault();
    setModalError('');
    try {
      await api.createMember({ full_name: fullName, document_number: docNumber });
      showFeedback('Socio registrado exitosamente');
      setShowModal(false);
      setFullName('');
      setDocNumber('');
      fetchMembers();
    } catch (err) {
      setModalError(err.message);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await api.getMemberById(id);
      setDetailMember(res);
    } catch (e) {
      showFeedback(e.message, 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Directorio de Socios</h1>
          <p className="page-desc">Consulta de socios, registro de nuevos usuarios y conteo de préstamos activos</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setModalError(''); setShowModal(true); }}>
          <Plus size={18} /> Nuevo Socio
        </button>
      </div>

      <div className="card" style={{ padding: '16px 20px', maxWidth: '480px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Buscar por nombre o documento..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Documento de Identidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', padding: '32px' }}>Cargando socios...</td></tr>
            ) : members.length === 0 ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No se encontraron socios registrados.</td></tr>
            ) : (
              members.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>{m.full_name}</td>
                  <td style={{ fontFamily: 'monospace' }}>{m.document_number}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleViewDetail(m.id)}>
                      Ver Préstamos Activos
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Mostrando {members.length} de {total} socios
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Anterior
          </button>
          <button className="btn btn-secondary btn-sm" disabled={page * 10 >= total} onClick={() => setPage(page + 1)}>
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal Alta Socio */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Registrar Nuevo Socio</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}><XCircle size={18} /></button>
            </div>
            <form onSubmit={handleCreateMember}>
              <div className="modal-body">
                {modalError && (
                  <div className="alert alert-danger">
                    <AlertTriangle size={16} />
                    <span>{modalError}</span>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Nombre Completo *</label>
                  <input className="form-input" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ej: Carlos Mendoza" />
                </div>
                <div className="form-group">
                  <label className="form-label">Número de Documento *</label>
                  <input className="form-input" required value={docNumber} onChange={(e) => setDocNumber(e.target.value)} placeholder="Ej: 1020304050" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalle Socio */}
      {detailMember && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Detalle de Socio</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setDetailMember(null)}><XCircle size={18} /></button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Nombre</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{detailMember.full_name}</div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Documento de Identidad</div>
                <div style={{ fontFamily: 'monospace' }}>{detailMember.document_number}</div>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '4px' }}>Libros actualmente sin devolver:</div>
                <span className={`badge ${detailMember.active_loans > 0 ? 'badge-overdue' : 'badge-open'}`} style={{ fontSize: '1rem', padding: '6px 14px' }}>
                  {detailMember.active_loans} / 3 libros
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDetailMember(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 3. VISTA DE PRÉSTAMOS
// ----------------------------------------------------
function LoansView({ role, showFeedback }) {
  const [loans, setLoans] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // New loan modal
  const [showModal, setShowModal] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const [booksList, setBooksList] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedBooks, setSelectedBooks] = useState(['']);
  const [modalError, setModalError] = useState('');

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await api.getLoans({ status: statusFilter, page, size: 10 });
      setLoans(res.items || []);
      setTotal(res.total || 0);
    } catch (e) {
      showFeedback(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [statusFilter, page]);

  const handleOpenNewLoan = async () => {
    setModalError('');
    setSelectedBooks(['']);
    try {
      const [mRes, bRes] = await Promise.all([
        api.getMembers({ size: 50 }),
        api.getBooks({ size: 50 }),
      ]);
      setMembersList(mRes.items || []);
      setBooksList(bRes.items || []);
      if (mRes.items?.length > 0) setSelectedMember(mRes.items[0].id);
      setShowModal(true);
    } catch (e) {
      showFeedback(e.message, 'error');
    }
  };

  const handleAddBookSlot = () => {
    if (selectedBooks.length < 3) {
      setSelectedBooks([...selectedBooks, '']);
    }
  };

  const handleRemoveBookSlot = (idx) => {
    if (selectedBooks.length > 1) {
      setSelectedBooks(selectedBooks.filter((_, i) => i !== idx));
    }
  };

  const handleBookChange = (idx, val) => {
    const updated = [...selectedBooks];
    updated[idx] = val;
    setSelectedBooks(updated);
  };

  const handleCreateLoan = async (e) => {
    e.preventDefault();
    setModalError('');

    const validBooks = selectedBooks.filter((id) => id.trim() !== '');
    if (validBooks.length === 0) {
      setModalError('Debe seleccionar al menos un libro.');
      return;
    }

    try {
      await api.createLoan({
        member_id: selectedMember,
        items: validBooks.map((id) => ({ book_id: id })),
      });
      showFeedback('Préstamo registrado exitosamente (vencimiento a 14 días)');
      setShowModal(false);
      fetchLoans();
    } catch (err) {
      setModalError(err.message);
    }
  };

  const handleReturnItem = async (loanId, itemId, title) => {
    if (!window.confirm(`¿Registrar la devolución de «${title}»?`)) return;
    try {
      await api.returnLoanItem(loanId, itemId);
      showFeedback('Línea devuelta e inventario reabastecido');
      fetchLoans();
    } catch (err) {
      showFeedback(err.message, 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Préstamos</h1>
          <p className="page-desc">Control de préstamos de 14 días, devolución por línea y estados en tiempo real</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenNewLoan}>
          <Plus size={18} /> Registrar Préstamo
        </button>
      </div>

      <div className="card" style={{ padding: '16px 20px', maxWidth: '320px' }}>
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">Todos los estados</option>
          <option value="open">Abierto (open)</option>
          <option value="overdue">Vencido (overdue)</option>
          <option value="closed">Cerrado (closed)</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>Cargando préstamos...</div>
        ) : loans.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No se encontraron préstamos registrados.</div>
        ) : (
          loans.map((loan) => (
            <div key={loan.id} className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Préstamo registrado el:</span>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                    {new Date(loan.loaned_at).toLocaleString('es-CO')}
                  </div>
                </div>
                <div>
                  <span className={`badge badge-${loan.status}`} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                    {loan.status}
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Líneas de Préstamo ({loan.items?.length || 0})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {loan.items?.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.book_title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          Cat: {item.category_name} &bull; ISBN: {item.isbn} &bull; Vence: {new Date(item.due_at).toLocaleDateString('es-CO')}
                        </div>
                      </div>
                      <div>
                        {item.returned_at ? (
                          <span className="badge badge-closed">
                            Devuelto el {new Date(item.returned_at).toLocaleDateString('es-CO')}
                          </span>
                        ) : (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleReturnItem(loan.id, item.id, item.book_title)}
                          >
                            <CheckCircle size={14} style={{ color: '#10b981' }} /> Registrar Devolución
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Nuevo Préstamo */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Registrar Préstamo</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}><XCircle size={18} /></button>
            </div>
            <form onSubmit={handleCreateLoan}>
              <div className="modal-body">
                {modalError && (
                  <div className="alert alert-danger">
                    <AlertTriangle size={16} />
                    <span>{modalError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Socio Solicitante *</label>
                  <select
                    className="form-select"
                    required
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                  >
                    {membersList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.full_name} ({m.document_number})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="form-label" style={{ margin: 0 }}>Libros a prestar (1 a 3 sin repetir) *</label>
                    {selectedBooks.length < 3 && (
                      <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddBookSlot}>
                        <Plus size={14} /> Añadir libro
                      </button>
                    )}
                  </div>

                  {selectedBooks.map((bId, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <select
                        className="form-select"
                        required
                        value={bId}
                        onChange={(e) => handleBookChange(idx, e.target.value)}
                      >
                        <option value="">Seleccione un libro...</option>
                        {booksList.map((book) => (
                          <option key={book.id} value={book.id} disabled={book.available_copies <= 0}>
                            {book.title} ({book.available_copies} disponibles)
                          </option>
                        ))}
                      </select>
                      {selectedBooks.length > 1 && (
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveBookSlot(idx)}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '0.8rem', color: '#64748b', background: '#eff6ff', padding: '10px 14px', borderRadius: '8px' }}>
                  &bull; El socio no puede superar 3 libros sin devolver en total.<br />
                  &bull; La fecha de vencimiento se calcula automáticamente a 14 días.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Confirmar Préstamo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 4. VISTA DE LIBROS VENCIDOS
// ----------------------------------------------------
function OverdueView({ showFeedback }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOverdue = async () => {
    setLoading(true);
    try {
      const res = await api.getOverdueLoans();
      setItems(res.items || []);
    } catch (e) {
      showFeedback(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverdue();
  }, []);

  const handleReturn = async (loanId, itemId, title) => {
    if (!window.confirm(`¿Registrar devolución de «${title}»?`)) return;
    try {
      await api.returnLoanItem(loanId, itemId);
      showFeedback('Libro devuelto con éxito');
      fetchOverdue();
    } catch (err) {
      showFeedback(err.message, 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Libros Vencidos</h1>
          <p className="page-desc">Listado operativo de líneas sin devolver con fecha de vencimiento anterior a hoy</p>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Libro</th>
              <th>Socio</th>
              <th>Fecha de Vencimiento</th>
              <th>Días de Retraso</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px' }}>Consultando libros vencidos...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#10b981', fontWeight: 600 }}>¡Excelente! No hay libros vencidos en este momento.</td></tr>
            ) : (
              items.map((i) => (
                <tr key={i.item_id}>
                  <td style={{ fontWeight: 700 }}>{i.book_title}</td>
                  <td>{i.member_name}</td>
                  <td style={{ fontFamily: 'monospace' }}>{new Date(i.due_at).toLocaleDateString('es-CO')}</td>
                  <td>
                    <span className="badge badge-overdue" style={{ fontSize: '0.85rem' }}>
                      {i.days_late} días tarde
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleReturn(i.loan_id, i.item_id, i.book_title)}>
                      Devolver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. VISTA DE REPORTES (SOLO ADMIN)
// ----------------------------------------------------
function ReportsView({ showFeedback }) {
  const [fromDate, setFromDate] = useState('2026-10-01');
  const [toDate, setToDate] = useState('2026-10-31');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await api.getMostBorrowedReport(fromDate, toDate);
      setRows(res.rows || []);
    } catch (err) {
      showFeedback(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reporte de Libros Más Prestados</h1>
          <p className="page-desc">Consulta agregada con datos congelados por período cerrado (ADR-004)</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={fetchReport} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Fecha Inicial *</label>
            <input type="date" className="form-input" required value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Fecha Final *</label>
            <input type="date" className="form-input" required value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <BarChart3 size={18} /> Generar Reporte
          </button>
        </form>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Libro (Congelado)</th>
              <th>Categoría (Congelada)</th>
              <th>Veces Prestado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', padding: '32px' }}>Generando reporte...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={3} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No se registraron préstamos en este rango de fechas.</td></tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700 }}>{r.book_title}</td>
                  <td>
                    <span className="badge" style={{ backgroundColor: '#f1f5f9' }}>{r.category_name}</span>
                  </td>
                  <td>
                    <span className="badge badge-copies" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                      {r.times_borrowed} préstamos
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 6. VISTA DE CREACIÓN DE BIBLIOTECARIOS (SOLO ADMIN)
// ----------------------------------------------------
function UsersView({ showFeedback }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.createLibrarian({
        username,
        password,
        role: 'librarian',
      });
      showFeedback(`Bibliotecario «${username.toLowerCase().trim()}» creado exitosamente`);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '560px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Alta de Bibliotecarios</h1>
          <p className="page-desc">Creación de cuentas operativas para el personal de la biblioteca</p>
        </div>
      </div>

      <div className="card">
        {error && (
          <div className="alert alert-danger">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre de Usuario *</label>
            <input
              type="text"
              className="form-input"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej: ana.garcia"
            />
            <small style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Se guardará automáticamente en minúsculas y recortado.
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña *</label>
            <input
              type="password"
              className="form-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rol Asignado</label>
            <input type="text" className="form-input" disabled value="librarian" />
            <small style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Por regla de seguridad, solo se permite crear cuentas con rol librarian.
            </small>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }} disabled={loading}>
            <UserPlus size={18} /> {loading ? 'Creando...' : 'Crear Bibliotecario'}
          </button>
        </form>
      </div>
    </div>
  );
}
