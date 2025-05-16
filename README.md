# MagicLog Marketplace - Prueba Técnica

## Tabla de Contenidos

- [Visión General del Proyecto](#visión-general-del-proyecto)
- [Estructura del Repositorio](#estructura-del-repositorio)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
  - [Backend (API)](#backend-api)
  - [Frontend](#frontend)
- [Características Implementadas](#características-implementadas)
  - [Generales](#generales)
  - [Para Vendedores](#para-vendedores)
  - [Para Compradores](#para-compradores)
  - [Para Administradores](#para-administradores)
- [Prerrequisitos](#prerrequisitos)
- [Instalación y Configuración](#instalación-y-configuración)
  - [1. Clonar el Repositorio](#1-clonar-el-repositorio)
  - [2. Configuración del Backend (API)](#2-configuración-del-backend-api)
  - [3. Configuración del Frontend](#3-configuración-del-frontend)
- [Ejecución](#ejecución)
  - [Backend (API)](#backend-api-1)
  - [Frontend](#frontend-1)
- [Documentación de la API](#documentación-de-la-api)
- [Roles de Usuario](#roles-de-usuario)
- [Pruebas (Backend)](#pruebas-backend)
- [Despliegue](#despliegue)

## Visión General del Proyecto

MagicLog Marketplace es una solución que permite a los vendedores registrarse, listar sus productos y gestionar su inventario. Los compradores pueden buscar productos, ver detalles y (simuladamente) añadirlos a un carrito. Los administradores tienen la capacidad de supervisar todos los productos de la plataforma y filtrar por vendedor.

## Estructura del Repositorio

Este es un monorepo que contiene dos aplicaciones principales:

-   `apps/marketplace-api/`: El backend desarrollado con NestJS.
-   `apps/marketplace-frontend/`: La interfaz de usuario desarrollada con React y Vite.

## Tecnologías Utilizadas

### Backend (API)

-   **Framework:** NestJS
-   **Lenguaje:** TypeScript
-   **Base de Datos:** PostgreSQL
-   **Autenticación:** JWT (JSON Web Tokens)
-   **Documentación:** Swagger (OpenAPI)
-   **Contenerización:** Docker, Docker Compose
-   **Pruebas:** Jest

### Frontend

-   **Framework/Librería:** React
-   **Bundler/Herramienta de Desarrollo:** Vite
-   **Lenguaje:** TypeScript (TSX)
-   **Manejo de Estado:** Redux Toolkit
-   **Enrutamiento:** React Router DOM
-   **Estilos:** Tailwind CSS
-   **Cliente HTTP:** Axios

## Características Implementadas

### Generales

-   Interfaz de usuario responsiva.
-   Navegación intuitiva y protección de rutas basada en roles.

### Para Vendedores

-   Registro de cuenta con email y contraseña.
-   Inicio de sesión.
-   Creación de productos (nombre, SKU, cantidad, precio).
-   Visualización y gestión de productos propios.
-   Dashboard de vendedor con estadísticas básicas y accesos directos.

### Para Compradores

-   Búsqueda de productos con filtros (nombre, SKU, rango de precios).
-   Visualización de detalles de productos.
-   Funcionalidad de añadir productos al carrito (gestionado en el estado del cliente).
-   Carrito de compras interactivo (drawer) para ver y modificar el pedido.

### Para Administradores

-   Inicio de sesión con cuenta de administrador.
-   Visualización de todos los productos registrados en la plataforma.
-   Filtrado de productos por vendedor (seleccionando de una lista de vendedores).
-   Dashboard de administrador con estadísticas globales y accesos rápidos.

## Prerrequisitos

-   Node.js (v20.x o superior)
-   npm (o yarn)
-   Docker y Docker Compose (para la base de datos del backend)
-   PostgreSQL (si no usas Docker para la base de datos)

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/codigo-natural/magiclog-marketplace.git
cd magiclog-marketplace
```
2. Configuración del Backend (API)

Navega al directorio del backend:
```Bash
cd apps/marketplace-api
```

Instalar dependencias:
```bash
npm install
```
*Configurar variables de entorno:*

Crea un archivo `.env` en el directorio `apps/marketplace-api/` basándote en `apps/marketplace-api/.env.example` con el siguiente contenido:

# Configuración de la base de datos
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres         # Usuario de tu PostgreSQL
DB_PASSWORD=your_password  # Contraseña de tu PostgreSQL
DB_NAME=marketplace      # Nombre de la base de datos

# Configuración de JWT
JWT_SECRET=tu_secreto_jwt_super_seguro
JWT_EXPIRATION_TIME=1d

# Configuración del servidor API
PORT=3000
```

**Iniciar la base de datos (usando Docker):**


Desde el directorio `apps/marketplace-api/` (donde está tu `docker-compose.yml`):

`docker-compose up -d`


3. Configuración del Frontend

Navega al directorio del frontend:
```bash
cd apps/marketplace-frontend
```

**Instalar dependencias:**

```bash
npm install
```

**Configurar variables de entorno:**

Crea un archivo `.env` en el directorio `apps/marketplace-frontend/` basándote en `apps/marketplace-frontend/.env.example` o con el siguiente contenido:
```bash
VITE_API_BASE_URL=http://localhost:3000
```

Asegúrate de que http://localhost:3000 coincida con el puerto donde se ejecuta tu backend API.

**Ejecución**

Abre dos terminales separadas.

Backend (API)

Desde el directorio `apps/marketplace-api/`:

Modo Desarrollo:

```bash
npm run start:dev
```

La API estará disponible en http://localhost:3000.

Modo Producción:
```bash
npm run build
npm run start:prod
```
**Frontend**

Desde el directorio `apps/marketplace-frontend/`:

**Modo Desarrollo:**

```bash
npm run dev
```

La aplicación frontend estará disponible generalmente en http://localhost:5173 (Vite te indicará el puerto exacto).

**Documentación de la API**

Una vez que el servidor backend (marketplace-api) esté en ejecución, la documentación de la API generada con Swagger estará disponible en:
http://localhost:3000/api-docs

Roles de Usuario

- **ADMIN (admin):** Acceso completo a la plataforma, incluyendo la visualización de todos los productos y la lista de vendedores.

     - Credenciales de Admin por defecto (seed del backend): admin@example.com / AdminPassword1!

- **SELLER (seller):** Puede registrarse, crear y gestionar sus propios productos.

- **Comprador (implícito):** Cualquier usuario (autenticado o no, que no sea vendedor o admin) puede buscar productos y añadirlos al carrito.

**Pruebas (Backend)**

Desde el directorio `apps/marketplace-api/`:

- Ejecutar todas las pruebas unitarias:
```bash
npm run test
```

- Ejecutar pruebas con reporte de cobertura:
```bash
npm run test:cov
```

- Ejecutar pruebas en modo observador (watch mode):
```bash
npm run test:watch
```

URL de la aplicación desplegada en Vercel: 

