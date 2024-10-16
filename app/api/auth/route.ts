import connect from "@/lib/db";
import Admin from "@/lib/modals/admins";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined. Please set it in your environment variables.");
} // Рекомендуется хранить в переменной окружения

export const POST = async (request: Request) => {
  try {
    await connect();
    const { username, password } = await request.json();

    // Ищем администратора с введенным username
    const admin = await Admin.findOne({ username: username.toLowerCase() });

    // Если администратор найден и пароли совпадают
    if (admin && admin.password === password) {
      // Генерация JWT токена
      const token = jwt.sign(
        { id: admin._id, username: admin.username, role: 'admin' },  // Payload токена
        JWT_SECRET,                                  // Секретный ключ для подписи
        { expiresIn: "1d" }                          // Время жизни токена
      );

      // Возвращаем токен в ответе
      return new NextResponse(
        JSON.stringify({ message: `Admin ${username} authenticated successfully`, token }),
        { status: 200 }
      );
    } else {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid username or password' }),
        { status: 401 }
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse('ERROR: ' + error.message, { status: 500 });
    } else {
      return new NextResponse('ERROR: An unknown error occurred', { status: 500 });
    }
  }
};
