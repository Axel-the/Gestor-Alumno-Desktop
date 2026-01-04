import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Calendar, MapPin, DollarSign, Clock, Info, Plus } from 'lucide-react';

const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

function StudentModal({ isOpen, onClose, onSave, student = null }) {
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        apoderado: '',
        email: '',
        telefono: '',
        nivel: '',
        grupo: '',
        dias: '',
        horario: '',
        fecha_inicio: '',
        fecha_fin: '',
        fecha_registro: '',
        mensualidad: '',
        estado: 'activo'
    });

    const [selectedDays, setSelectedDays] = useState([]);

    useEffect(() => {
        if (student) {
            const initialDays = student.Dias ? student.Dias.split(',').map(d => d.trim()) : [];
            setSelectedDays(initialDays);
            setFormData({
                nombres: student.Nombres || '',
                apellidos: student.Apellidos || '',
                apoderado: student.Apoderado || '',
                email: student.Email || '',
                telefono: student.Teléfono || student.Telefono || '',
                nivel: student.Nivel || '',
                grupo: student.Grupo || '',
                dias: student.Dias || '',
                horario: student.Horario || '',
                fecha_inicio: formatDateForInput(student['Fecha Inicio']),
                fecha_fin: formatDateForInput(student['Fecha fin']),
                fecha_registro: formatDateForInput(student['Fecha Registro']),
                mensualidad: student.Mensualidad || '',
                estado: student.Estado || 'activo',
                original_nombres: student.Nombres,
                original_apellidos: student.Apellidos
            });
        } else {
            setSelectedDays([]);
            setFormData({
                nombres: '', apellidos: '', apoderado: '', email: '', telefono: '',
                nivel: '', grupo: '', dias: '', horario: '', fecha_inicio: '',
                fecha_fin: '', fecha_registro: '', mensualidad: '', estado: 'activo'
            });
        }
    }, [student, isOpen]);

    const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return '';
            const y = date.getUTCFullYear();
            const m = String(date.getUTCMonth() + 1).padStart(2, '0');
            const d = String(date.getUTCDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        } catch { return ''; }
    };

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        let finalData = { ...formData, dias: selectedDays.join(', ') };

        // Si no hay fecha de registro, poner la de hoy
        if (!finalData.fecha_registro) {
            const today = new Date();
            const y = today.getFullYear();
            const m = String(today.getMonth() + 1).padStart(2, '0');
            const d = String(today.getDate()).padStart(2, '0');
            finalData.fecha_registro = `${y}-${m}-${d}`;
        }

        onSave(finalData);
    };

    const toggleDay = (day) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content-premium">
                <header className="modal-header">
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                            {student ? 'Editar Expediente' : 'Nuevo Registro'}
                        </h2>
                        <p style={{ color: 'var(--text-label)', fontSize: '0.85rem' }}>Complete los datos del alumno de forma precisa.</p>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </header>

                <form onSubmit={handleSubmit} className="modal-form">
                    <section className="form-section">
                        <h4 className="section-title"><User size={16} /> Información Personal</h4>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nombres</label>
                                <input className="input-field" value={formData.nombres} onChange={(e) => setFormData({ ...formData, nombres: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Apellidos</label>
                                <input className="input-field" value={formData.apellidos} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label><Info size={14} /> Apoderado</label>
                                <input className="input-field" value={formData.apoderado} onChange={(e) => setFormData({ ...formData, apoderado: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label><Phone size={14} /> Teléfono</label>
                                <input className="input-field" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
                                <label><Mail size={14} /> Correo Electrónico</label>
                                <input type="email" className="input-field" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>
                    </section>

                    <section className="form-section">
                        <h4 className="section-title"><Calendar size={16} /> Programa Académico</h4>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nivel / Categoría</label>
                                <input className="input-field" value={formData.nivel} onChange={(e) => setFormData({ ...formData, nivel: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Grupo</label>
                                <input className="input-field" value={formData.grupo} onChange={(e) => setFormData({ ...formData, grupo: e.target.value })} />
                            </div>

                            <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
                                <label>Asistencia Semanal</label>
                                <div className="days-selector">
                                    {DAYS_OF_WEEK.map(day => (
                                        <button
                                            key={day} type="button" onClick={() => toggleDay(day)}
                                            className={`day-tag ${selectedDays.includes(day) ? 'selected' : ''}`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label><Clock size={14} /> Horario</label>
                                <input className="input-field" value={formData.horario} onChange={(e) => setFormData({ ...formData, horario: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label><DollarSign size={14} /> Mensualidad</label>
                                <input type="number" className="input-field" value={formData.mensualidad} onChange={(e) => setFormData({ ...formData, mensualidad: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Inicio del Programa</label>
                                <input type="date" className="input-field" value={formData.fecha_inicio} onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Fin del Programa</label>
                                <input type="date" className="input-field" value={formData.fecha_fin} onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Fecha de Registro</label>
                                <input type="date" className="input-field" value={formData.fecha_registro} onChange={(e) => setFormData({ ...formData, fecha_registro: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Estado del Alumno</label>
                                <select className="input-field" value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })}>
                                    <option value="activo">Activo</option>
                                    <option value="suspendido">Suspendido</option>
                                    <option value="renovado">Renovado</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <footer className="modal-footer">
                        <button type="button" className="btn-donezo btn-donezo-outline" onClick={onClose} style={{ padding: '8px 20px' }}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-donezo btn-donezo-primary" style={{ padding: '8px 24px' }}>
                            <Plus size={16} /> {student ? 'Actualizar' : 'Registrar'}
                        </button>
                    </footer>
                </form>
            </div>

            <style>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px;
        }
        .modal-content-premium {
          background: #ffffff; border: 1px solid #e2e8f0;
          width: 90%; maxWidth: 480px; maxHeight: 85vh;
          border-radius: 12px; display: flex; flex-direction: column; overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: modalAppear 0.2s ease-out;
        }
        @keyframes modalAppear {
          from { opacity: 0; transform: scale(0.98) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-header {
          padding: 16px 20px; border-bottom: 1px solid #e2e8f0;
          display: flex; justify-content: space-between; align-items: center;
          background: #f8fafc;
        }
        .close-btn {
          background: #ffffff; border: 1px solid #e2e8f0; color: #64748b;
          width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: var(--transition);
        }
        .close-btn:hover { background: #fee2e2; color: #ef4444; border-color: #fecaca; }
        .modal-form { padding: 20px; overflow-y: auto; flex: 1; }
        .form-section { margin-bottom: 20px; }
        .section-title {
          font-size: 0.75rem; color: #1e293b; margin-bottom: 12px;
          display: flex; align-items: center; gap: 6px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.8;
        }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-group { display: flex; flex-direction: column; gap: 4px; }
        .form-group label { font-size: 0.7rem; color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 4px; }
        .input-field { 
          padding: 8px 12px; font-size: 0.9rem; border: 1px solid #e2e8f0; 
          background: #f8fafc; color: #1e293b; border-radius: 8px; outline: none;
        }
        .input-field:focus { border-color: var(--primary); background: #ffffff; }
        .days-selector { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; }
        .day-tag {
          padding: 4px 8px; border-radius: 6px; border: 1px solid #e2e8f0;
          background: #ffffff; color: #64748b; cursor: pointer;
          font-size: 0.7rem; font-weight: 500; transition: var(--transition);
        }
        .day-tag:hover { border-color: #94a3b8; color: #1e293b; }
        .day-tag.selected { background: var(--primary); color: #fff; border-color: var(--primary); }
        .modal-footer {
          padding: 12px 20px; border-top: 1px solid #e2e8f0;
          display: flex; justify-content: flex-end; gap: 8px; background: #f8fafc;
        }
      `}</style>
        </div>
    );
}

export default StudentModal;
