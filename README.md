# MyGymBrou — AI Fitness, Live Gym & Vision Nutrition (WCAG AAA)

Aplicación Full-Stack moderna para el mundo del Fitness y Hipertrofia construida con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, **Prisma (PostgreSQL)** y soporte nativo para **Ollama** (`llama3.2` / `qwen2.5` y `llama3.2-vision` / `minicpm-v`), lista para desplegar en **Dokploy**.

## Características Principales

1. **Sistema de Color Fitness con Certificación WCAG AAA (Ratio ≥ 7.0:1)**:
   - **Modo Oscuro en Escala de Grises Pura (`#09090B` / `#121214` / `#18181B`)**: Sin tintes azules ni morados en el fondo; acentos energéticos en Verde Lima Neón (`#A3E635` — contraste `12.8:1 AAA`) y Cyan Deportivo (`#22D3EE` — contraste `11.1:1 AAA`).
   - **Modo Claro Neutro de Alto Contraste (`#FFFFFF` / `#F4F4F5`)**: Acentos profundos Esmeralda (`#14532D` — contraste `9.1:1 AAA`) y Cyan Profundo (`#155E75` — contraste `7.6:1 AAA`).
2. **Módulo A — Gym Live Session**:
   - Seguimiento en vivo con peso y repeticiones de la sesión anterior como referencia.
   - Botón **Completar Serie** que dispara automáticamente el **Cronómetro Flotante de Descanso** (`60s`, `90s`, `120s`, `180s`) con alerta sonora Web Audio API y vibración.
   - Selector rápido de **RPE / RIR** y marcaje de fallo muscular.
   - **Asistente Biomecánico en Vivo (Ollama)**: Sugiere ejercicios sustitutos con la misma curva de resistencia cuando una polea/máquina está ocupada o existe molestia articular.
3. **Módulo B — Nutrición, Dieta y Vision Calorie Estimator Híbrido (Estilo Fitia)**:
   - Pipeline híbrido sin alucinaciones: Ollama (`llama3.2-vision`) identifica ingredientes visibles y la app cruza cada alimento con la tabla nutricional estandarizada (USDA FoodData Central / SQL) permitiendo ajustar los gramos con sliders en tiempo real.
4. **Módulo C — Seguimiento Corporal y Estadísticas**:
   - Gráfica interactiva de **Peso Corporal Diario vs. Promedio Móvil de 7 Días** para aislar fluctuaciones de agua.
   - Gráfica de **Sobrecarga Progresiva (1RM Estimado con fórmula de Epley)** y alertas autónomas de estancamiento.
5. **Módulo D — Calendario Integrado y Detección de Fatiga del SNC**:
   - Planificador semanal (*Push / Pull / Legs*, *Upper / Lower*, *Full Body*) con detector automático de fatiga acumulada tras 4 días seguidos de carga alta.

## Ejecución Local

```bash
npm install
npm run dev
```

## Despliegue en Dokploy con Docker Compose

```bash
docker compose up -d --build
# Descargar modelos en el contenedor de Ollama:
docker exec -it mygymbrou-ollama ollama pull llama3.2
docker exec -it mygymbrou-ollama ollama pull llama3.2-vision
```
