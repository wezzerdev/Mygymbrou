# Dockerfile ultra robusto para Dokploy (Next.js Standalone con Supabase)
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 1. Instalar dependencias
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Compilar aplicación
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Valores por defecto de Supabase para que queden incrustados en el build de Next.js
ARG NEXT_PUBLIC_SUPABASE_URL=https://oasfvjaukwanhlqngtir.supabase.co
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hc2Z2amF1a3dhbmhscW5ndGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNjMyNjAsImV4cCI6MjEwODgzOTI2MH0.mUxPv53wkgJSXr7T-d7dRGpGF-3BxThnPTNcXgQ6ktw

ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# 3. Runner ligero para producción
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENV NEXT_PUBLIC_SUPABASE_URL=https://oasfvjaukwanhlqngtir.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hc2Z2amF1a3dhbmhscW5ndGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNjMyNjAsImV4cCI6MjEwODgzOTI2MH0.mUxPv53wkgJSXr7T-d7dRGpGF-3BxThnPTNcXgQ6ktw

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar assets estáticos y bundle standalone generado por Next.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
