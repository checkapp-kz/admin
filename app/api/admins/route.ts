import connect from "@/lib/db";
import Admin from "@/lib/modals/admins";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined. Please set it in your environment variables.");
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
    const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (decodedToken.role !== "admin") {
      return { status: 403, message: "Недостаточно прав для выполнения этого действия!" };
    }
  } catch (err) {
    console.error("Ошибка проверки токена:", err);
    return { status: 403, message: "Неверный токен!" };
  }

  return null; // Нет ошибок, всё ок.
};

// Получение списка администраторов (GET)
export const GET = async (request: Request) => {
  try {
    const authError = checkAdminRights(request);
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status });

    await connect();
    const admins = await Admin.find();
    return NextResponse.json(admins, { status: 200 });
  } catch (err) {
    console.error('Ошибка сервера:', err); // Используем переменную err
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
};

// Добавление нового администратора (POST)
export const POST = async (request: Request) => {
  try {
    const authError = checkAdminRights(request);
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status });

    await connect();
    const { username, password } = await request.json();

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return NextResponse.json({ message: "Администратор с таким именем уже существует" }, { status: 400 });
    }

    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    return NextResponse.json({ message: "Администратор создан успешно" }, { status: 200 });
  } catch (err) {
    console.error('Ошибка сервера:', err); // Используем переменную err
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
};

// Удаление администратора (DELETE)
export const DELETE = async (request: Request) => {
  try {
    const authError = checkAdminRights(request);
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status });

    await connect();
    const { id } = await request.json();

    const adminToDelete = await Admin.findByIdAndDelete(id);
    if (!adminToDelete) {
      return NextResponse.json({ message: "Администратор не найден" }, { status: 404 });
    }

    return NextResponse.json({ message: "Администратор успешно удалён" }, { status: 200 });
  } catch (err) {
    console.error('Ошибка сервера:', err); // Используем переменную err
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
};

// Изменение администратора (PUT)
export const PUT = async (request: Request) => {
  try {
    const authError = checkAdminRights(request);
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status });

    await connect();
    const { id, password } = await request.json();

    const adminToUpdate = await Admin.findById(id);
    if (!adminToUpdate) {
      return NextResponse.json({ message: "Администратор не найден" }, { status: 404 });
    }

    adminToUpdate.password = password;
    await adminToUpdate.save();

    return NextResponse.json({ message: "Пароль успешно обновлён" }, { status: 200 });
  } catch (err) {
    console.error('Ошибка сервера:', err); // Используем переменную err
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
};
