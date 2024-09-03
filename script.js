const { S3 } = require('@aws-sdk/client-s3');
const axios = require('axios');

// Конфигурация для Яндекс Object Storage
const s3 = new S3({
    endpoint: "https://storage.yandexcloud.net",
    region: "ru-central1",
    credentials: {
        accessKeyId: "",
        secretAccessKey: ""
    }
});
//key is in my saved messages

const BUCKET_NAME = 'my-alisa-commands';
const COMMAND_FILE = 'computer_commands.json';

// Функция для управления музыкой через API Умного дома
async function controlSmartHome(deviceId, action) {
    // Заглушка, замените на реальный код
    return { success: true };
}

// Функция для отправки команды компьютеру через Object Storage
async function sendCommandToComputer(command) {
    const params = {
        Bucket: BUCKET_NAME,
        Key: COMMAND_FILE,
        Body: JSON.stringify({ command, timestamp: Date.now() }),
    };
    await s3.putObject(params);
}

// Обработчик запуска WebStorm
async function launchWebstorm() {
    try {
        await sendCommandToComputer('launch_webstorm');
        return {
            text: 'Команда на запуск WebStorm отправлена. Пожалуйста, убедитесь, что ваш компьютер включен и проверяет команды.',
            end_session: false
        };
    } catch (error) {
        console.error('Ошибка при отправке команды:', error);
        return {
            text: 'Извините, не удалось отправить команду. Пожалуйста, попробуйте позже.',
            end_session: false
        };
    }
}

// Обработчик управления музыкой
async function controlMusic(action) {
    const deviceId = 'your_yandex_station_id'; // Замените на реальный ID вашей Яндекс Станции

    try {
        await controlSmartHome(deviceId, action);
        return {
            text: action === 'play_music' ? 'Плейлист "Голяк" запущен на колонке.' : 'Музыка остановлена.',
            end_session: false
        };
    } catch (error) {
        console.error('Ошибка при управлении музыкой:', error);
        return {
            text: 'Извините, не удалось управлять музыкой. Пожалуйста, проверьте вашу Яндекс Станцию.',
            end_session: false
        };
    }
}

// Главная функция навыка
async function handler(event) {
    const { request, session, version } = event;

    let response = {
        text: 'Извините, я не поняла команду. Вы можете попросить меня запустить WebStorm, включить или выключить музыку.',
        end_session: false
    };

    if (request.command.includes('запусти вебшторм')) {
        response = await launchWebstorm();
    } else if (request.command.includes('включи музыку')) {
        response = await controlMusic('play_music');
    } else if (request.command.includes('выключи музыку')) {
        response = await controlMusic('stop_music');
    }

    return {
        version,
        session,
        response: response
    };
}

module.exports = { handler };