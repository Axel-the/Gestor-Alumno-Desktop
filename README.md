# Gestor Alumno - Desktop 🖥️🎓

**Gestor Alumno** es una aplicación de escritorio profesional diseñada para la gestión eficiente de expedientes estudiantiles, sincronizada en tiempo real con **Google Sheets**. Ofrece una interfaz moderna, limpia y rápida (estilo Donezo) para administrar alumnos, estados, pagos y contactos.

---

## 🚀 Características Principales

- **Dashboard Ejecutivo:** Resumen visual de alumnos totales, activos y suspendidos.
- **Gestión Completa de Alumnos:** Crear, editar y eliminar registros con sincronización inmediata.
- **Búsqueda Avanzada:** Filtros multipolar por nombre, nivel, grupo o contacto.
- **Integración Táctica:**
  - **WhatsApp Directo:** Envía mensajes con un solo clic.
  - **Email Interactivo:** Acceso rápido para comunicación oficial.
- **Reportes:** Descarga de base de datos en formato CSV compatible con Excel.
- **Multiplataforma:** Aplicación de escritorio optimizada (Windows).
- **Branding Personalizado:** Logo e identidad visual propia.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React + Vite
- **Desktop:** Electron
- **Estilos:** CSS Vanilla (Premium Donezo Style)
- **Iconos:** Lucide React
- **Backend:** Google Apps Script + Google Sheets API

---

## 📥 Instalación

Si solo deseas usar la aplicación sin programar:
1. Descarga el archivo `Gestor_Alumno_Portable.zip`.
2. Descomprímelo en tu PC.
3. Ejecuta `Gestor Alumno.exe`.

---

## 👨‍💻 Configuración para Desarrolladores

Si deseas modificar el código o compilarlo tú mismo:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Axel-the/Gestor-Alumno-Desktop.git
   cd Gestor-Alumno-Desktop
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Compilar para producción (Crear .exe):**
   ```bash
   npm run dist
   ```

---

## ⚙️ Integración con Google Sheets

La aplicación utiliza un script de Google Apps Script como puente. Asegúrate de tener configurada la URL de tu Web App en `src/services/studentService.js`.

**Estructura de la Hoja de Cálculo sugerida:**
- Nombres, Apellidos, Apoderado, Email, Teléfono, Nivel, Grupo, Dias, Horario, Fecha Inicio, Fecha fin, Mensualidad, Fecha Registro, Estado.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

Desarrollado con ❤️ para la gestión educativa.
