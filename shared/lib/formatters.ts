// src/shared/lib/formatters.ts

/**
 * Форматирует телефонный номер в формат +7 XXX XXX XXXX
 * @param value Строка с номером телефона
 * @returns Отформатированный номер телефона
 */
export const formatPhoneNumber = (value: string): string => {
    if (!value) return '+7 ';

    // Удаляем все нецифровые символы
    const digits = value.replace(/\D/g, '');

    // Ограничиваем до 11 цифр (с кодом страны)
    const limitedDigits = digits.slice(0, 11);

    // Если первая цифра не 7, подставляем 7
    const normalizedDigits = limitedDigits.startsWith('7')
        ? limitedDigits
        : '7' + limitedDigits.slice(limitedDigits.startsWith('7') ? 1 : 0);

    // Форматируем номер
    let formattedNumber = '+7';

    if (normalizedDigits.length > 1) {
        formattedNumber += ' ';
        // Добавляем первые 3 цифры после кода
        if (normalizedDigits.length >= 4) {
            formattedNumber += normalizedDigits.slice(1, 4);
        } else {
            formattedNumber += normalizedDigits.slice(1);
        }
    }

    if (normalizedDigits.length > 4) {
        formattedNumber += ' ';
        // Добавляем следующие 3 цифры
        if (normalizedDigits.length >= 7) {
            formattedNumber += normalizedDigits.slice(4, 7);
        } else {
            formattedNumber += normalizedDigits.slice(4);
        }
    }

    if (normalizedDigits.length > 7) {
        formattedNumber += ' ';
        // Добавляем оставшиеся цифры
        formattedNumber += normalizedDigits.slice(7, 11);
    }

    return formattedNumber;
};

/**
 * Форматирует ИИН (убирает все нецифровые символы и ограничивает до 12 цифр)
 * @param value Строка с ИИН
 * @returns Отформатированный ИИН
 */
export const formatIIN = (value: string): string => {
    if (!value) return '';

    // Удаляем все нецифровые символы и ограничиваем до 12 цифр
    return value.replace(/\D/g, '').slice(0, 12);
};
