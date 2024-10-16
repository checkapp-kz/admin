import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/modals/users";

const NEXT_PUBLIC_JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

if (!NEXT_PUBLIC_JWT_SECRET) {
  throw new Error("NEXT_PUBLIC_JWT_SECRET is not defined. Please set it in your environment variables.");
}

// Функция для проверки прав доступа
const checkAdminRights = (request: Request) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return { status: 401, message: "Требуется аутентификация!" };
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return { status: 401, message: "Токен не предоставлен!" };
  }

  try {
    const decodedToken = jwt.verify(token, NEXT_PUBLIC_JWT_SECRET) as JwtPayload;
    if (decodedToken.role !== "admin") {
      return { status: 403, message: "Недостаточно прав для выполнения этого действия!" };
    }
  } catch (err) {
    console.error("Ошибка проверки токена:", err);
    return { status: 403, message: "Неверный токен!" };
  }

  return null; // Нет ошибок, всё ок.
};

// GET запрос: получение списка пользователей
export const GET = async (request: Request) => {
  try {
    const authError = checkAdminRights(request);
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status });

    await connect();
    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error('Ошибка сервера:', err);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
};

// DELETE запрос: удаление пользователя по ID
export const DELETE = async (request: Request) => {
  try {
    const authError = checkAdminRights(request);
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status });

    await connect();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "ID пользователя не предоставлен!" }, { status: 400 });
    }

    // Удаляем пользователя
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: "Пользователь не найден!" }, { status: 404 });
    }

    return NextResponse.json({ message: "Пользователь успешно удалён." }, { status: 200 });
  } catch (err) {
    console.error('Ошибка сервера:', err);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
};
