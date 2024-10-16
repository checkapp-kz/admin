import { Resend } from 'resend';
import {NextRequest, NextResponse} from 'next/server';
import {PartnerMailTemplate} from "@/components/partnerMailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY не задан в переменных окружения.");
}

export async function POST(request: NextRequest) {
  try {
    const { mail, text, name } = await request.json();

    if (!mail || !text) {
      return NextResponse.json(
        { message: 'Отсутствуют необходимые параметры (to, subject, text или html)' },
        { status: 400 }
      );
    }

    const emailResponse = await resend.emails.send({
      from: 'info@checkapp.kz',
      to: 'batrbekk@gmail.com',
      subject: `Партнерство от ${mail}`,
      react: PartnerMailTemplate({partner_name: name, text: text, mail: mail}),
    });

    console.log('Ответ от Resend:', emailResponse);

    // Успешный ответ
    return NextResponse.json({ message: 'Email отправлен успешно!' }, { status: 200 });
  } catch (error: unknown) {
    // Ловим любые ошибки и возвращаем сообщение об ошибке
    if (error instanceof Error) {
      console.error('Ошибка при отправке email:', error.message);
      return NextResponse.json({ message: `Ошибка: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ message: 'Неизвестная ошибка' }, { status: 500 });
  }
}
