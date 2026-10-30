# 🚀 Guía de Despliegue en Dokploy: MyGymBrou

Esta guía te explica paso a paso cómo subir **MyGymBrou** a tu servidor con **Dokploy** y conectarlo con **Supabase**.

---

## 1. Subir tu Repositorio a GitHub (o GitLab)

Si aún no tienes el repositorio remoto en GitHub:
1. Crea un nuevo repositorio en [github.com/new](https://github.com/new) llamado `MyGymBrou` (puedes ponerlo público o privado).
2. En tu terminal ejecuta:
```bash
git remote add origin https://github.com/TU_USUARIO/MyGymBrou.git
git push -u origin main
```

---

## 2. Crear la Aplicación en Dokploy

1. Abre tu panel de **Dokploy**.
2. Ve a tu **Project** o crea uno nuevo (ej. `Fitness Apps`).
3. Haz clic en **Create Service** y selecciona **Application**.
4. Nombra la aplicación: `mygymbrou`.

---

## 3. Configuración de Despliegue (Source & Build)

En la pestaña **General** de tu aplicación en Dokploy:

- **Source Type:** `Git` / `GitHub`
- **Repository:** Selecciona tu repositorio `TU_USUARIO/MyGymBrou`.
- **Branch:** `main`
- **Build Type:** Selecciona **Dockerfile** (el proyecto incluye un `Dockerfile` multi-stage ultra optimizado con Next.js Standalone).
- **Dockerfile Path:** `./Dockerfile` (por defecto).

---

## 4. Configurar las Variables de Entorno en Dokploy

En la pestaña **Environment** de tu aplicación en Dokploy, pega las siguientes variables:

```env
PORT=3000
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Supabase (Project Settings -> API en tu panel de Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.TU_CLAVE_ANONIMA

# Conexión directa a PostgreSQL Supabase (Opcional si usas Prisma)
DATABASE_URL=postgresql://postgres.TU_REF:TU_PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.TU_REF:TU_PASSWORD@aws-0-region.pooler.supabase.com:5432/postgres

# Servicio de IA Vision / Ollama (si tienes un contenedor de Ollama en Dokploy o local)
OLLAMA_BASE_URL=http://localhost:11434
```

> ⚠️ **Importante**: En Dokploy, asegúrate de activar la casilla **Build Argument** (o `ARG`) para `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` para que Next.js pueda integrarlas durante la compilación del Dockerfile.

---

## 5. Puerto y Dominio

En la pestaña **Domains** / **Ports**:
- **Container Port:** `3000`
- **Domain:** Asigna tu dominio (ej. `app.tudominio.com` o el dominio generado por Traefik/Dokploy).
- Activa **HTTPS / SSL (Let's Encrypt)** con un solo clic.

---

## 6. Desplegar

Haz clic en **Deploy**. 
Dokploy clonará el repositorio, ejecutará el Dockerfile en etapas, levantará el contenedor en el puerto 3000 y asignará el certificado SSL automáticamente.
