# Frontend React — Manager Library (ADSO 3145555)

Aplicación Single Page Application (SPA) desarrollada con React y Vite para la gestión operativa de *Manager Library*.

## Características Implementadas

- **Autenticación y Roles (HU-01):** Soporte para inicio de sesión de `admin` y `librarian`, almacenamiento de token JWT en localStorage con expiración de 8 horas.
- **Catálogo de Libros (HU-03 & HU-04):** Búsqueda parcial por título/autor, filtro por categoría, inventario de copias disponibles y totales, alta y edición de libros, baja lógica y gestión de portadas.
- **Directorio de Socios (HU-05):** Consulta, búsqueda y registro de socios con validación de documento único y visualización de libros activos sin devolver.
- **Módulo de Préstamos (HU-06, HU-07, HU-08):**
  - Registro de préstamos de 1 a 3 libros por socio sin repetir.
  - Vencimiento automático a 14 días con congelamiento de datos de catálogo (Artículo VIII).
  - Devolución individual por línea reabasteciendo el stock de disponibles de manera inmediata.
  - Filtros por rango de fechas, socio y estado calculado (`open`, `overdue`, `closed`).
- **Libros Vencidos (HU-09):** Listado ordenado por mayor cantidad de días de retraso.
- **Reporte de Libros Más Prestados (HU-10):** Agrupación por libro y categoría congelada en períodos cerrados.
- **Alta de Bibliotecarios (HU-02):** Creación de nuevos operadores con rol `librarian`.

## Ejecución en Desarrollo

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar el servidor Vite:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.
