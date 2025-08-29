
# WB Box Tariff API

[![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)](https://nodejs.org/)
[![Postgres](https://img.shields.io/badge/Postgres-16-blue)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

RESTful API для управления тарифами и ценами на доставку в интернет-магазинах.
Поддерживает синхронизацию данных с **Google Sheets** и обновление тарифов через **Wildberries API**.

---

## 🚀 Стек приложения

- Node.js (TypeScript)
- PostgreSQL (knex.js)
- Google APIs (Sheets)
- Cron (периодические задачи)
- Zod (валидация)

---

## 🔑 Ключевые функции

- Получение и обновление тарифов и цен доставки в PostgreSQL каждый час
- Синхронизация тарифов с Google Sheets
- Поддержка Wildberries Tariffs API
- Гибкая настройка через `.env`

---

## 📦 Установка и запуск

### Локально

```bash
git clone https://github.com/RqtHqck/wb_box_tariffs_api.git
cd wb_box_tariffs_api
npm install
```

Создать `.env` файл (см. [пример](#пример-env))

Запустить PostgreSQL:

```bash
docker compose up --build postgres
```

Запустить API:

```bash
npm run dev
```

---

### Docker

```bash
git clone https://github.com/RqtHqck/wb_box_tariffs_api.git
cd wb_box_tariffs_api
```

Создать `.env` файл, затем:

```bash
docker compose up --build
```

---

## ⚙️ Пример `.env`

```env
APP_PORT=5000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=wb_tariffs
POSTGRES_USER=admin
POSTGRES_PASSWORD=secret

GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
GOOGLE_SPREADSHEET_IDS=spreadsheet_id1,spreadsheet_id2
GOOGLE_SPREADSHEET_TAB_NAME=Tariffs

WB_API_BEARER_TOKEN=your_token_here
```

---

## 📂 Структура проекта

├── 📁 config/

│   ├── 📁 env/ 🚫 (auto-hidden)

│   └── 📁 knex/

├── 📁 errors/

├── 📁 helpers/

├── 📁 interfaces/

├── 📁 middlewares/

├── 📁 postgres/

│   ├── 📁 migrations/

│   ├── 📁 seeds/

├── 📁 repositories/

├── 📁 services/

├── 📁 utils/

└── 📄 app.ts

<pre class="vditor-reset" placeholder="" contenteditable="true" spellcheck="false"><hr data-block="0"/></pre>

## 🔐 Google Sheets

1. Создать Service Account в [Google Cloud Console](https://console.cloud.google.com/)
2. Скачать JSON ключ
3. Указать путь в `.env` → `GOOGLE_APPLICATION_CREDENTIALS`

Подробнее:

- [Googleapis NPM](https://www.npmjs.com/package/googleapis#service-account-credentials)
- [Google Sheets integration guide](https://medium.com/@sakkeerhussainp/google-sheet-as-your-database-for-node-js-backend-a79fc5a6edd9)

---

## 🌍 Wildberries Tariffs API

Документация: [WB Tariffs API](https://dev.wildberries.ru/openapi/wb-tariffs/#tag/Koefficienty-skladov/paths/~1api~1v1~1tariffs~1box/get)

Необходимо указать JWT-токен в `.env`:

```env
WB_API_JWT=your_token_here
```

---
