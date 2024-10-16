import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import User from '@/lib/modals/users';
import connectDB from '@/lib/db';

export async function POST(request: Request) {
  try {
    await connectDB(); // Подключаемся к базе данных

    const { email, name, password, role } = await request.json();

    // Проверяем, что все поля заполнены
    if (!email || !name || !password) {
      return NextResponse.json({ message: 'Все поля обязательны' }, { status: 400 });
    }

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Пользователь с таким email уже существует' }, { status: 400 });
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем нового пользователя
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      role: role || 'user',
    });

    // Сохраняем пользователя в базе данных
    await newUser.save();

    // Успешный ответ
    return NextResponse.json({ message: 'Пользователь успешно зарегистрирован' }, { status: 201 });

  } catch (error: unknown) {
    console.error('Ошибка при регистрации пользователя:', error);
    return NextResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
