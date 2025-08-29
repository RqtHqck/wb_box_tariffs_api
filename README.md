# **WB Box Tariff API**

## **Описание проекта**

WB Box Tariff API - это RESTful API, разработанный для управления тарифами и ценами на доставку для интернет-магазинов. API позволяет получать и обновлять информацию о тарифах, а также синхронизировать данные с Google Sheets.

## **Стек приложения**

* nodejs
* ts
* postgreSQL
* knex.js
* googleapis
* cron
* zod

## **Ключевые функции**

* Получение и обновление тарифов и цен на доставку в базе данных PostgreSQL (knex.js)
* Синхронизация данных с Google Sheets (googleapis)
* Возможность настройки и конфигурирования API через env

## **Установка и запуск**

### Локальная установка

1. Клонировать репозиторий:

   ```
   git clone https://github.com/RqtHqck/wb_box_tariffs_api.git
   ```
2. Установить зависимости:

   ```
   npm install
   ```
3. Создать файл

   ```
   .env
   ```

   с необходимыми переменными окружения .example.env
4. Запустить postgres с docker:

   ```
   docker compose up --build postgres
   ```
5. Запустить API:

   ```
   npm run dev
   ```

### Установка с помощью Docker

1. Клонировать репозиторий:

   ```
   git clone https://github.com/RqtHqck/wb_box_tariffs_api.git
   ```
2. Создать файл

   ```
   .env
   ```
   с необходимыми переменными окружения .example.env
3. Запустить контейнер:

   ```
   docker compose up --build
   ```


### Дополнительно

Необходимо создать serviceAccount с помощью ** google cloud console **. Затем скачать JSON ключа, и указать путь в переменной env: GOOGLE_APPLICATION_CREDENTIALS.

Так же необходимо иметь рабочий JWT от wildberries api

Ids google spreadsheets также следует указывать в env:: GOOGLE_SPREADSHEET_IDS через запятую (как указано в примере с .example.env)

Название таблицы env: GOOGLE_SPREADSHEET_TAB_NAME


### Полезные материалы к установке

* https://www.npmjs.com/package/googleapis#service-account-credentials
* https://medium.com/@sakkeerhussainp/google-sheet-as-your-database-for-node-js-backend-a79fc5a6edd9
* https://console.cloud.google.com/
* https://www.google.com/url?q=https://dev.wildberries.ru/openapi/wb-tariffs/%23tag/Koefficienty-skladov/paths/~1api~1v1~1tariffs~1box/get&sa=D&source=editors&ust=1756233975608806&usg=AOvVaw32mEC6uzNXerPNXGXiDyr9