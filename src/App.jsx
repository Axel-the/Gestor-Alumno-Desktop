import React, { useState, useEffect } from 'react';
import {
    Users,
    LayoutDashboard,
    Search,
    Bell,
    Mail,
    ArrowUpRight,
    Plus,
    Download,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    Clock,
    Trash2,
    Edit2,
    RefreshCw,
    Phone,
    Menu,
    X
} from 'lucide-react';
import { studentService } from './services/studentService';
import StudentModal from './components/StudentModal';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const data = await studentService.getStudents();
            setStudents(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveStudent = async (formData) => {
        setLoading(true);
        try {
            if (editingStudent) {
                await studentService.updateStudent(formData);
            } else {
                await studentService.createStudent(formData);
            }
            setIsModalOpen(false);
            setEditingStudent(null);
            fetchStudents();
        } catch (error) {
            alert('Error al guardar');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (nombres, apellidos) => {
        if (confirm(`¿Eliminar a ${nombres} ${apellidos}?`)) {
            setLoading(true);
            try {
                await studentService.deleteStudent(nombres, apellidos);
                fetchStudents();
            } catch (error) {
                alert('Error al eliminar');
            } finally {
                setLoading(false);
            }
        }
    };

    const filteredStudents = students.filter(s => {
        if (!s) return false;
        const nombres = (s.Nombres || '').toString().toLowerCase();
        const apellidos = (s.Apellidos || '').toString().toLowerCase();
        const email = (s.Email || '').toString().toLowerCase();
        const telefono = (s.Teléfono || s.Telefono || '').toString();
        const nivel = (s.Nivel || '').toString().toLowerCase();
        const grupo = (s.Grupo || '').toString().toLowerCase();
        const searchLower = searchTerm.toLowerCase();

        const matchesSearch =
            nombres.includes(searchLower) ||
            apellidos.includes(searchLower) ||
            email.includes(searchLower) ||
            telefono.includes(searchTerm) ||
            nivel.includes(searchLower) ||
            grupo.includes(searchLower);

        const matchesStatus = statusFilter === 'todos' ||
            (s.Estado && s.Estado.toString().toLowerCase() === statusFilter.toLowerCase());

        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: students.filter(Boolean).length,
        active: students.filter(s => s && s.Estado?.toString().toLowerCase() === 'activo').length,
        suspended: students.filter(s => s && s.Estado?.toString().toLowerCase() === 'suspendido').length,
        renovated: students.filter(s => s && s.Estado?.toString().toLowerCase() === 'renovado').length,
    };

    const downloadReport = () => {
        if (students.length === 0) {
            alert('No hay datos para descargar');
            return;
        }

        // Definir los encabezados basados en la estructura de Google Sheet
        const headers = [
            'Nombres', 'Apellidos', 'Apoderado', 'Email', 'Teléfono',
            'Nivel', 'Grupo', 'Dias', 'Horario', 'Fecha Inicio',
            'Fecha fin', 'Mensualidad', 'Estado'
        ];

        const csvRows = [];
        // Añadir BOM para que Excel reconozca los acentos (UTF-8)
        csvRows.push('\uFEFF' + headers.join(';'));

        students.forEach(s => {
            const values = headers.map(header => {
                // Manejar tanto con tilde como sin tilde para Teléfono
                let val = '';
                if (header === 'Teléfono') val = s['Teléfono'] || s['Telefono'] || '';
                else val = s[header] || '';

                // Limpiar saltos de línea y escapar comillas
                return `"${String(val).replace(/"/g, '""').replace(/\n/g, ' ')}"`;
            });
            csvRows.push(values.join(';'));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `reporte_alumnos_${new Date().toISOString().split('T')[0]}.csv`);
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="app-wrapper">
            {/* Sidebar Donezo Style */}
            <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <img src="./logo.jpeg" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} />
                    <span className="logo-text">Gestor Alumno</span>
                    <button className="close-menu-btn" onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="sidebar-nav">
                    <div className="nav-section-title">Menu</div>
                    <div
                        className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                    >
                        <LayoutDashboard size={20} /> Dashboard
                    </div>
                    <div
                        className={`nav-btn ${activeTab === 'students' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('students'); setIsMobileMenuOpen(false); }}
                    >
                        <Users size={20} /> Alumnos
                    </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <div className="card-donezo" style={{ background: 'var(--primary-bg)', padding: '16px', borderRadius: '16px', border: 'none' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>App Desktop</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Gestión centralizada de alumnos.</p>
                        <button
                            className="btn-donezo btn-donezo-primary"
                            style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem', padding: '8px' }}
                            onClick={downloadReport}
                        >
                            <Download size={14} /> Descargar reporte
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Container */}
            <div className="main-container">
                {/* Header */}
                <header className="top-header" style={{ height: 'auto', padding: '16px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                            <button className="menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
                                <Menu size={24} color="var(--text-main)" />
                            </button>

                            <div className="search-bar" style={{ flex: 1 }}>
                                <Search size={18} color="var(--text-label)" />
                                <input
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="header-actions">
                            <div className="profile-card">
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'white' }}>AD</div>
                                <div className="profile-info-desktop">
                                    <p style={{ fontSize: '0.8rem', fontWeight: '700' }}>Gestor Alumno</p>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-label)' }}>Conectado</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', paddingBottom: '4px', overflowX: 'auto' }}>
                        {['todos', 'activo', 'suspendido', 'renovado'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    border: '1px solid',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textTransform: 'capitalize',
                                    backgroundColor: statusFilter === status ? 'var(--primary)' : 'white',
                                    color: statusFilter === status ? 'white' : 'var(--text-muted)',
                                    borderColor: statusFilter === status ? 'var(--primary)' : 'var(--border)'
                                }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Content Area */}
                <main className="content-area">
                    <div className="dashboard-title-row">
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{activeTab === 'dashboard' ? 'Dashboard' : 'Alumnos'}</h1>
                            <p className="subtitle-text" style={{ color: 'var(--text-label)', fontSize: '0.9rem' }}>
                                {activeTab === 'dashboard' ? 'Planifica y supervisa a tus alumnos con facilidad.' : 'Gestiona los registros y perfiles académicos.'}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn-donezo btn-donezo-outline icon-only-mobile" onClick={fetchStudents} title="Sincronizar">
                                <RefreshCw size={16} className={loading && !isModalOpen ? 'spin' : ''} />
                                <span className="hide-on-mobile">Sincronizar</span>
                            </button>
                            <button className="btn-donezo btn-donezo-primary icon-only-mobile" onClick={() => { setEditingStudent(null); setIsModalOpen(true); }} title="Agregar Alumno">
                                <Plus size={18} /> <span className="hide-on-mobile">Agregar Alumno</span>
                            </button>
                        </div>
                    </div>

                    {activeTab === 'dashboard' && (
                        <div className="fade-up">
                            <div className="stat-grid-donezo">
                                <div className="stat-box highlight">
                                    <div className="arrow-box"><ArrowUpRight size={16} color="white" /></div>
                                    <span className="stat-title">Total Alumnos</span>
                                    <div className="stat-value">{stats.total}</div>
                                    <div className="stat-footer"><Users size={12} /> Base de datos completa</div>
                                </div>

                                <div className="stat-box">
                                    <div className="arrow-box"><ArrowUpRight size={16} /></div>
                                    <span className="stat-title">Alumnos Activos</span>
                                    <div className="stat-value">{stats.active}</div>
                                    <div className="stat-footer" style={{ color: 'var(--primary)' }}> <CheckCircle2 size={12} /> En curso</div>
                                </div>

                                <div className="stat-box">
                                    <div className="arrow-box"><ArrowUpRight size={16} /></div>
                                    <span className="stat-title">Suspendidos</span>
                                    <div className="stat-value">{stats.suspended}</div>
                                    <div className="stat-footer" style={{ color: '#ef4444' }}> <AlertCircle size={12} /> Requieren atención</div>
                                </div>

                                <div className="stat-box">
                                    <div className="arrow-box"><ArrowUpRight size={16} /></div>
                                    <span className="stat-title">Renovados</span>
                                    <div className="stat-value">{stats.renovated}</div>
                                    <div className="stat-footer" style={{ color: 'var(--primary)' }}> <Clock size={12} /> Ciclo nuevo</div>
                                </div>
                            </div>

                            <div className="dashboard-row-2">
                                <div className="card-donezo">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                        <h3 style={{ fontSize: '1rem' }}>Sincronización Reciente</h3>
                                        <MoreVertical size={16} color="var(--text-label)" cursor="pointer" />
                                    </div>
                                    <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>
                                        <RefreshCw size={48} style={{ marginBottom: '16px' }} />
                                        <p>La conexión con Google Sheets está activa y saludable.</p>
                                    </div>
                                </div>

                                <div className="card-donezo">
                                    <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>Progreso de Ciclo</h3>
                                    <div style={{ padding: '20px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)' }}>
                                            {Math.round((stats.active / stats.total) * 100) || 0}%
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-label)' }}>Alumnos activos del total</p>
                                        <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '10px', marginTop: '20px', overflow: 'hidden' }}>
                                            <div style={{ width: `${(stats.active / stats.total) * 100}%`, height: '100%', background: 'var(--primary)' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'students' && (
                        <div className="fade-up">
                            <div className="card-donezo" style={{ padding: '0px', overflow: 'hidden' }}>
                                <table className="table-donezo">
                                    <thead>
                                        <tr>
                                            <th>Alumno / Colaboración</th>
                                            <th>Contacto Directo</th>
                                            <th>Programa / Horario</th>
                                            <th>Estado</th>
                                            <th style={{ textAlign: 'right' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStudents.filter(Boolean).map((s, idx) => (
                                            <tr key={idx}>
                                                <td data-label="Alumno">
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', border: '1px solid var(--border-strong)', color: 'var(--primary)', overflow: 'hidden' }}>
                                                            {String(s.Nombres || '?')[0]}{String(s.Apellidos || '?')[0]}
                                                        </div>
                                                        <div style={{ textAlign: 'left' }}>
                                                            <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>{s.Nombres || 'Sin nombre'} {s.Apellidos || ''}</p>
                                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-label)' }}>Resp: {s.Apoderado || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td data-label="Contacto">
                                                    {s.Email ? (
                                                        <a
                                                            href={`mailto:${s.Email}`}
                                                            title="Enviar correo"
                                                            style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600', display: 'block' }}
                                                        >
                                                            {s.Email}
                                                        </a>
                                                    ) : (
                                                        <p style={{ fontSize: '0.85rem' }}>Sin email</p>
                                                    )}

                                                    {(s.Teléfono || s.Telefono) ? (
                                                        <a
                                                            href={`https://wa.me/${(s.Teléfono || s.Telefono).toString().replace(/\D/g, '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Enviar WhatsApp"
                                                            style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', justifyContent: 'flex-end' }}
                                                        >
                                                            <Phone size={10} /> {s.Teléfono || s.Telefono}
                                                        </a>
                                                    ) : (
                                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-label)' }}>-</p>
                                                    )}
                                                </td>
                                                <td data-label="Programa">
                                                    <p style={{ fontWeight: '600', fontSize: '0.85rem' }}>Nivel {s.Nivel} • {s.Grupo}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-label)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                                                        <Clock size={12} /> {s.Horario || 'Sin horario'}
                                                    </p>
                                                </td>
                                                <td data-label="Estado">
                                                    <span className={`status-pill status-${String(s.Estado || 'desconocido').toLowerCase()}`} style={{ transform: 'scale(0.9)', transformOrigin: 'right' }}>
                                                        {s.Estado || 'Desconocido'}
                                                    </span>
                                                </td>
                                                <td data-label="Acciones" style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                                        <button className="btn-donezo btn-donezo-outline" style={{ padding: '6px', minWidth: 'auto', borderRadius: '8px' }} onClick={() => { setEditingStudent(s); setIsModalOpen(true); }}>
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button className="btn-donezo btn-donezo-outline" style={{ padding: '6px', minWidth: 'auto', borderRadius: '8px', color: '#ef4444' }} onClick={() => handleDelete(s.Nombres, s.Apellidos)}>
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredStudents.length === 0 && (
                                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-label)' }}>
                                        <Search size={40} style={{ opacity: 0.1, marginBottom: '16px' }} />
                                        <p>No se encontraron resultados.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <StudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveStudent}
                student={editingStudent}
            />

            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
        </div>
    );
}

export default App;
