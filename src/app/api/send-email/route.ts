import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    // Проверяем метод запроса
    if (request.method !== 'POST') {
      return NextResponse.json(
        { success: false, message: 'Метод не поддерживается' },
        { status: 405 }
      );
    }

    // Получаем данные из запроса
    const formData = await request.json();

    // Валидация данных
    if (!formData.name || !formData.email || !formData.message) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Пожалуйста, заполните все обязательные поля' 
        },
        { status: 400 }
      );
    }

    // Подготавливаем данные для шаблона
    const emailData = {
      from_name: formData.name,
      input_email: formData.email,
      subject: formData.subject || 'Запрос с сайта',
      message: formData.message,
    };

    // Отправляем письмо
    const success = await sendContactFormEmail(emailData);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Сообщение успешно отправлено!'
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Ошибка при отправке сообщения. Пожалуйста, попробуйте позже.' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Произошла внутренняя ошибка сервера'
      },
      { status: 500 }
    );
  }
}