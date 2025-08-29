# Используем Node.js
FROM node:20-alpine

# Создаём рабочую папку
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock)
COPY package*.json ./

# Устанавливаем все зависимости сразу (включая dev, чтобы был tsc)
RUN npm install

# Копируем весь исходный код
COPY . .

# Билдим TypeScript
RUN npm run build

# Указываем команду запуска
CMD ["node", "dist/app.js"]
