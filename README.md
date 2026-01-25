# Target Scan

Proyecto de análisis automático de requerimientos, código y diseño (Figma)

## 📌 Objetivo del Proyecto

El propósito de este proyecto es desarrollar un chat de IA especializado en validar los desarrollos implementados en el sitio web mediante Adobe Target, siguiendo el mismo enfoque estructural utilizado previamente en la IA APA para pruebas automatizadas con Playwright.

Esta IA permitirá analizar requerimientos, código e interfaces, con el fin de asegurar calidad, consistencia visual y cumplimiento técnico antes de que las implementaciones lleguen a QA y producción.

## 📝 Descripción General

La IA recibirá como inputs:

- 📸 Imágenes del diseño en Figma (si el desarrollo lo incluye).
- 📄 Descripción exacta del requerimiento funcional.
- 💻 Código desarrollado para cumplir dicho requerimiento.

A partir de esta información, la IA generará de forma automática un análisis estandarizado que apoye al equipo de desarrollo, QA y producto.

## 📤 Resultados Generados por la IA

### 1️⃣ Análisis del Requerimiento

La IA desglosará el requerimiento identificando:
- Escenarios funcionales que deben cumplir los desarrolladores.
- Escenarios de validación para el equipo de QA.
- Criterios de aceptación implícitos o faltantes.
- Riesgos o dependencias técnicas.

### 2️⃣ Análisis del Código

El motor de análisis validará que el código cumpla con estándares mínimos definidos:

- ⏱️ Intervalos de ejecución ≥ 500 ms
- ❌ No se permite el uso de Mutation Observers
- ❌ Prohibido uso de múltiples hilos de ejecución
- 🏷️ Variables descriptivas
- 📦 Código modular, legible y mantenible
- ❌ No se aceptan estructuras monolíticas
- ✔️ Buenas prácticas y consistencia general

### 3️⃣ Comparativa entre Diseño (Figma) y Desarrollo

La IA evaluará:

- Diferencias visuales
- Espaciados, tamaños, tipografías
- Comportamiento esperado vs. implementado
- Cumplimiento del lineamiento UI/UX del proyecto

Esto permite validar la correcta visualización final y alertar inconsistencias antes de QA.

### 4️⃣ Historial y Preservación de la Información

El sistema mantendrá un historial persistente que permitirá:

- Consultas retrospectivas
- Auditoría de análisis
- Comparativa entre versiones

## 🧩 Entrenamiento de la IA

La IA podrá ser entrenada con los códigos existentes en el repositorio de IDX:
🔗 https://studio.firebase.google.com/target-avianca-617947

Estos códigos servirán como base para comprender patrones, estándares y estructuras usadas actualmente por el equipo.

## ☁️ Infraestructura y Alojamiento

Inicialmente el proyecto se alojará en GitHub.
Se contempla una futura migración hacia Azure para servicios más robustos y escalables.

## 🚀 Resultado Esperado

El sistema final será un chat inteligente con funcionamiento similar a la IA utilizada en pruebas automatizadas con Playwright, capaz de recibir:

✔️ Imagen de referencia del desarrollo
✔️ Imagen de Figma
✔️ Requerimiento funcional
✔️ Código implementado

Y generar de manera automática todo el análisis detallado requerido, reduciendo tiempos de validación y estandarizando los criterios entre equipos.

## Author
Desarrollado por: [Fainner Ramirez de la hoz 🍵](https://faidev.vercel.app/)  
Rol: Frontend Developer  
Tecnologías: React, TypeScript  
Proyecto realizado para: Avianca S.A

## 🛠️ Tecnologías Consideradas (Propuesta)

OpenAI / Gemini Google
GitHub Actions para CI/CD
Firebase / IDX para entrenamiento inicial