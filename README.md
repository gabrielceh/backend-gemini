# GEMINI APP BACKEND

## DEV

1. Clonar el repositorio
2. Instalar dependencias con `npm install`
3. Crear un archivo `.env` en la raíz del proyecto basado en el archivo `.env.template`
4. Cambiar variables de entorno en el archivo `.env`

## 🚀 NestJS + Gemini API

Este proyecto es un servicio construido con NestJS
que integra la API de Gemini de Google para consumir modelos de inteligencia artificial y generar respuestas en lenguaje natural.

## 📌 Características

✅ Arquitectura modular con NestJS

✅ Integración con Gemini API (Google Generative AI)

✅ Uso de DTOs y validaciones con class-validator

✅ Configuración centralizada con ConfigService

✅ Listo para expandirse con más endpoints y servicios de IA

## 📂 Estructura del proyecto

```
src/
├── config/ # Configuración general (env, api keys)
├── gemini/ # Módulo para la integración con Gemini
│ ├── dtos/
│ ├── helpers/
│ ├── use-cases/
│ ├── gemini.service.ts
│ ├── gemini.module.ts
│ └── gemini.controller.ts
├── app.module.ts # Módulo raíz de la aplicación
└── main.ts # Bootstrap de NestJS
```

## ⚙️ Instalación y configuración

1. Clonar el repositorio
   git clone https://github.com/gabrielceh/backend-gemini.git
   cd backend-gemini

2. Instalar dependencias
   npm install

3. Variables de entorno

Crea un archivo .env en la raíz del proyecto:

```env
GEMINI_API_KEY = ""
API_URL = ""
```

1. Levantar el servidor
   npm run start:dev

## 🔑 Uso de la API

Endpoint: POST /gemini/basic-prompt

Ejemplo de request:

```json
{
  "prompt": "Explícame el principio de inercia de manera sencilla"
}
```

Ejemplo de response:

```json
{
  "result": "El principio de inercia dice que un objeto se mantiene en reposo o en movimiento rectilíneo uniforme mientras no actúe una fuerza externa sobre él."
}
```

## 🛠️ Tecnologías utilizadas

NestJS

Google Generative AI SDK

Class Validator

TypeScript
