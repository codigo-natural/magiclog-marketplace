# Backend - API

API REST para un marketplace desarrollada con NestJS, TypeScript y PostgreSQL.

## Características

- 🔐 Autenticación JWT
- 👥 Roles de usuario (Admin, Vendedor, Comprador)
- 📦 Gestión de productos
- 🔍 Búsqueda de productos con filtros
- 📝 Documentación con Swagger
- 🧪 Pruebas unitarias
- 🐳 Configuración Docker

## Requisitos Previos

- Node.js (v20 o superior)
- PostgreSQL
- Docker y Docker Compose

## Instalación

1. Clonar el repositorio:
```bash
git clone
cd marketplace-api
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=marketplace

# Configuración de JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1d

# Configuración del servidor
PORT=3000
```

4. Iniciar la base de datos:
```bash
# Usando Docker
docker-compose up -d

## Ejecución

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

## Documentación API

La documentación de la API está disponible en Swagger UI cuando el servidor está en ejecución:
```
http://localhost:3000/api-docs
```

### Endpoints Principales

#### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registro de usuarios

#### Productos
- `POST /products` - Crear producto (requiere rol SELLER o ADMIN)
- `GET /products/me` - Obtener productos del vendedor (requiere rol SELLER)
- `GET /products/search` - Buscar productos
- `GET /products/:id` - Obtener producto por ID

## Roles de Usuario

- **ADMIN**: Acceso total al sistema
- **SELLER**: Puede crear y gestionar sus productos
- **BUYER**: Puede buscar y ver productos

## Pruebas

### Ejecutar pruebas unitarias
```bash
npm run test
```

### Ejecutar pruebas con cobertura
```bash
npm run test:cov
```

### Ejecutar pruebas en modo watch
```bash
npm run test:watch
```

