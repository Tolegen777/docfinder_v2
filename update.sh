#!/bin/bash

echo "🔄 Обновление DocFinder v2 с Git..."
echo "=================================="

# Переход в папку проекта
cd /home/ubuntu/docfinder

# Проверка текущей ветки
echo "📋 Текущая ветка: $(git branch --show-current)"
echo "📋 Последний коммит: $(git log -1 --oneline)"

# Получение обновлений
echo "📥 Получение обновлений из Git..."
git fetch origin main

# Проверка есть ли новые коммиты
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ $LOCAL = $REMOTE ]; then
    echo "✅ Проект уже актуален. Обновления не требуются."
    echo "📊 Статус контейнера:"
    sudo docker-compose ps
    exit 0
fi

echo "🆕 Найдены новые обновления!"
echo "📋 Новые коммиты:"
git log --oneline $LOCAL..$REMOTE

# Подтверждение обновления
read -p "🤔 Продолжить обновление? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Обновление отменено"
    exit 1
fi

# Остановка контейнера
echo "⏹️ Остановка текущего контейнера..."
sudo docker-compose down

# Обновление кода
echo "📥 Обновление кода..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при обновлении кода из Git"
    echo "🔄 Запуск старой версии..."
    sudo docker-compose up -d
    exit 1
fi

# Сборка и запуск обновленной версии
echo "🔨 Сборка обновленного образа..."
sudo docker-compose build --no-cache

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при сборке Docker образа"
    echo "🔄 Попытка запуска старой версии..."
    sudo docker-compose up -d
    exit 1
fi

echo "🚀 Запуск обновленного контейнера..."
sudo docker-compose up -d

# Проверка статуса
echo "✅ Проверка статуса..."
sleep 5
sudo docker-compose ps

# Проверка логов
echo "📊 Последние логи:"
sudo docker-compose logs --tail=10

echo ""
echo "🎉 Обновление завершено!"
echo "📋 Текущий коммит: $(git log -1 --oneline)"
echo "🌐 Сайт доступен: https://docfinder.kz"
echo "📋 Для просмотра логов: sudo docker-compose logs -f"
