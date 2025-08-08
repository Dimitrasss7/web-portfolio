
import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = '8439262546:AAE0GzLPwPtiDGErdd8NbbCWzQXiAoYnfCc';
const TELEGRAM_CHAT_ID = '8201070854'; // Ваш Telegram chat ID

export async function POST(request: NextRequest) {
  try {
    const { telegramNick, orderDescription, contactInfo, timestamp } = await request.json();

    if (!telegramNick || !orderDescription) {
      return NextResponse.json(
        { error: 'Telegram nick and order description are required' },
        { status: 400 }
      );
    }

    // Format message for Telegram
    const message = `🆕 НОВЫЙ ЗАКАЗ
    
👤 Клиент: ${telegramNick}
📞 Контакты: ${contactInfo || 'Не указаны'}
📅 Дата: ${new Date(timestamp).toLocaleString('ru-RU')}

📋 ОПИСАНИЕ ЗАКАЗА:
${orderDescription}

---
Для связи с клиентом: ${telegramNick}`;

    // Send message to Telegram
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to send message to Telegram' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
