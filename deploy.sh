#!/bin/bash

echo "🚀 Начинаем деплой DocFinder v2..."

# Остановка и удаление старых контейнеров
echo "📦 Остановка старых контейнеров..."
sudo docker stop docfinder_nextjs_1 2>/dev/null || true
sudo docker rm docfinder_nextjs_1 2>/dev/null || true

# Удаление старых образов (опционально)
echo "🗑️ Очистка старых образов..."
sudo docker system prune -f

# Сборка и запуск новых контейнеров
echo "🔨 Сборка нового образа..."
sudo docker-compose build --no-cache

echo "🚀 Запуск контейнера..."
sudo docker-compose up -d

# Проверка статуса
echo "✅ Проверка статуса контейнера..."
sudo docker-compose ps

echo "📊 Последние логи:"
sudo docker-compose logs --tail=20

echo "🎉 Деплой завершен!"
echo "🌐 Сайт доступен по адресу: https://docfinder.kz"
echo "📋 Для просмотра логов: sudo docker-compose logs -f"
