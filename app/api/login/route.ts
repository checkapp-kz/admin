import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '@/lib/modals/users';
import connectDB from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined. Please set it in your environment variables.");
} // Рекомендуется хранить в переменной окружения

export async function POST(request: Request) {
  try {
    await connectDB(); // Подключаемся к базе данных

    const { email, password } = await request.json();

    // Проверяем, что все поля заполнены
    if (!email || !password) {
      return NextResponse.json({ message: 'Все поля обязательны' }, { status: 400 });
    }

    // Находим пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
    }

    // Проверяем правильность пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Неверный пароль' }, { status: 401 });
    }

    // Генерируем JWT-токен
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET as string, // Убедитесь, что JWT_SECRET определен
      { expiresIn: '1d' } // Время действия токена
    );

    // Успешный ответ с токеном
    return NextResponse.json({ token }, { status: 200 });

  } catch (error: unknown) {
    console.error('Ошибка при авторизации пользователя:', error);
    return NextResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
