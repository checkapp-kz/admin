"use client"

import Image from "next/image";
import Logo from "@/app/public/logo.svg";
import {Input} from "@/components/ui/input";
import {PasswordInput} from "@/components/ui/password-input";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {setCookie} from "cookies-next";
import {useRouter} from "next/navigation";

export default function Home() {
  const [isError, setIsError] = useState<boolean>(false);
  const router = useRouter();

  const formSchema = z.object({
    username: z.string().min(2, {
      message: "Напишите пожалуйста корректный username",
    }),
    password: z.string().min(2, {
      message: "Напишите пожалуйста корректный password",
    })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setIsError(false);
        const data = await response.json();
        setCookie('jwt-token', data.token);
        router.push('/dashboard');
      } else {
        console.error('Error:', response.statusText);
        setIsError(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
    }
  }

  return (
    <main className="mx-auto container min-h-dvh flex items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-xl gap-y-6">
        <div className="flex items-center gap-x-2">
          <Image src={Logo} alt="logo" />
          <h4 className="text-xl font-semibold">CheckApp</h4>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg border p-4 w-full flex flex-col items-center gap-y-4">
            <div className="flex flex-col gap-y-2 w-full">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-y-1 w-full">
                    <FormControl>
                      <Input
                        className="focus-visible:ring-transparent"
                        placeholder="Username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sunrise" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-y-1 w-full">
                    <FormControl>
                      <PasswordInput
                        className="focus-visible:ring-transparent"
                        placeholder="Password" {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sunrise" />
                  </FormItem>
                )}
              />
              {isError && (
                <small className="text-red-500">Введите верный <span className="text-sunrise">username</span> или <span className="text-sunrise">password</span></small>
              )}
            </div>
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
