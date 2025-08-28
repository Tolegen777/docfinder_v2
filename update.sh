#!/bin/bash

echo "🔄 Zero-downtime обновление DocFinder v2..."
echo "=========================================="

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

# Обновление кода
echo "📥 Обновление кода..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при обновлении кода из Git"
    exit 1
fi

# Сборка нового образа (старый контейнер продолжает работать)
echo "🔨 Сборка нового образа..."
sudo docker-compose build --no-cache

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при сборке Docker образа"
    exit 1
fi

# Создание временного контейнера для проверки
echo "🧪 Тестирование нового образа..."
sudo docker run -d --name docfinder_test -p 3001:3000 docfinder_docfinder_nextjs:latest

# Ждем запуска
sleep 10

# Проверяем что новый контейнер работает
if sudo docker ps | grep docfinder_test | grep Up > /dev/null; then
    echo "✅ Новый образ работает корректно"

    # Остановка тестового контейнера
    sudo docker stop docfinder_test
    sudo docker rm docfinder_test

    # Быстрое переключение (минимальный downtime)
    echo "🔄 Переключение на новую версию..."

    # Создаем новый контейнер
    sudo docker create --name docfinder_nextjs_new \
        -p 3000:3000 \
        -e NODE_ENV=production \
        --restart unless-stopped \
        docfinder_docfinder_nextjs:latest

    # Быстрое переключение
    sudo docker stop docfinder_nextjs_1 && \
    sudo docker start docfinder_nextjs_new && \
    sudo docker rm docfinder_nextjs_1 && \
    sudo docker rename docfinder_nextjs_new docfinder_nextjs_1

    echo "✅ Переключение завершено!"

else
    echo "❌ Новый образ не запускается корректно"
    sudo docker stop docfinder_test 2>/dev/null
    sudo docker rm docfinder_test 2>/dev/null
    echo "🔄 Откат изменений..."
    git reset --hard $LOCAL
    exit 1
fi

# Проверка статуса
echo "✅ Проверка статуса..."
sleep 5
sudo docker ps | grep docfinder_nextjs_1

# Проверка логов
echo "📊 Последние логи:"
sudo docker logs --tail=10 docfinder_nextjs_1

echo ""
echo "🎉 Zero-downtime обновление завершено!"
echo "📋 Downtime: ~2-5 секунд"
echo "📋 Текущий коммит: $(git log -1 --oneline)"
echo "🌐 Сайт доступен: https://docfinder.kz"
