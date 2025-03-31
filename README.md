# Proyecto: Gestor de Proyectos (Prueba Técnica)

Este proyecto es una aplicación web desarrollada con Vue 3 + Vite que permite gestionar proyectos, tareas y usuarios con roles diferenciados (RH, Planning, Developer y Tester).

---

## 🚀 Funcionalidades principales

- Login con autenticación por token
- Redirección según el rol del usuario
- Gestión de usuarios (crear, editar, cambiar contraseña)
- Gestión de proyectos (crear, editar, asignar usuarios)
- Gestión de tareas (crear, editar, asignar usuarios, cambiar estado)
- Navegación protegida según el rol
- Vistas responsivas y dinámicas por rol

---

## 🧪 Usuarios de prueba

Se puede iniciar sesión con cualquiera de los siguientes roles:

| Rol       | Correo                   | Contraseña       |
|-----------|---------------------------|------------------|
| RH        | rh1@example.com           | rh1password       |
| Planning  | planning1@example.com     | planning1password |
| Developer | developer1@example.com    | developer1password |

---

## 🛠️ Instalación

```bash
# Clona el proyecto
git clone https://github.com/tu-usuario/tu-repo.git

cd tu-repo

# Instala dependencias
yarn install

# Ejecuta en desarrollo
yarn run dev
