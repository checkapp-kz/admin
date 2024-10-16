"use client"

import {getCookie} from "cookies-next";
import {useCallback, useEffect, useState} from "react";
import {Admin} from "@/app/types/dashboard";
import {Pencil, Trash2, User, UserPlus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {PasswordInput} from "@/components/ui/password-input";
import {Input} from "@/components/ui/input";

export default function Dashboard () {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const token = getCookie('jwt-token');

  const [newUsername, setNewUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const [updatePassword, setUpdatePassword] = useState<string>('');
  const [currentId, setCurrentId] = useState<string>();

  const [openNewUser, setOpenNewUser] = useState(false);
  const [openUpdateUser, setOpenUpdateUser] = useState(false);
  const [openDeleteUser, setOpenDeleteUser] = useState(false);


  const getAdmins = useCallback(async () => {
    const response = await fetch('/api/admins/', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setAdmins(data);
    }
  }, [token]);

  const addNewAdmin = useCallback(async () => {
    const response = await fetch('/api/admins', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: newUsername,
        password: newPassword
      }),
    });

    if (response.ok) {
      await getAdmins();
      setOpenNewUser(false);
    }
  }, [getAdmins, newPassword, newUsername, token]);

  const updateAdmin = useCallback(async () => {
    const response = await fetch('/api/admins', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: currentId,
        password: updatePassword
      }),
    });

    if (response.ok) {
      await getAdmins();
      setOpenUpdateUser(false);
    }
  }, [currentId, getAdmins, token, updatePassword]);

  const deleteAdmin = useCallback(async () => {
    const response = await fetch('/api/admins', {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: currentId,
      }),
    });

    if (response.ok) {
      await getAdmins();
      setOpenDeleteUser(false);
    }
  }, [currentId, getAdmins, token]);

  useEffect(() => {
    getAdmins();
  }, [getAdmins]);

  return (
    <main className="container mx-auto pt-8">
      <div className="flex items-center justify-between gap-x-8">
        <h1 className="text-4xl font-semibold">Администраторы</h1>
        <Dialog open={openNewUser} onOpenChange={setOpenNewUser}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <UserPlus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавление нового администратора</DialogTitle>
              <div className="flex flex-col gap-y-2 py-8">
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Username"
                />
                <PasswordInput
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Пароль"
                />
              </div>
              <DialogFooter className="justify-end">
                <Button
                  className="bg-blue-600 hover:bg-blue-500"
                  onClick={addNewAdmin}
                >
                  Сохранить
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Назад
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogHeader>

          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-y-2 mt-12">
        {admins.length > 0 && (
          admins.map((admin) => (
            <div key={admin._id} className="flex items-center justify-between w-full border-b pb-2">
              <div className="flex items-center gap-x-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-300">
                  <User className="w-6 h-6 text-white" />
                </div>
                <p className="text-xl capitalize">{admin.username}</p>
              </div>
              <div className="flex items-center gap-x-1">
                <Dialog
                  open={openUpdateUser}
                  onOpenChange={setOpenUpdateUser}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCurrentId(admin._id);
                        setUpdatePassword('');
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Изменения пароля</DialogTitle>
                      <DialogDescription>Пожалуйста введите новый пароль для администратора</DialogDescription>
                    </DialogHeader>
                    <PasswordInput
                      value={updatePassword}
                      onChange={(e) => setUpdatePassword(e.target.value)}
                      placeholder="Новый пароль"
                      aria-hidden={true}
                    />
                    <DialogFooter className="justify-end">
                      <Button
                        className="bg-blue-600 hover:bg-blue-500"
                        onClick={updateAdmin}
                      >
                        Сохранить
                      </Button>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Назад
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={openDeleteUser}
                  onOpenChange={setOpenDeleteUser}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCurrentId(admin._id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Вы уверены что хотите удалить администратора ?</DialogTitle>
                      <DialogDescription>
                        После удаления данного администратора он не сможет пользоваться админ-панелью
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="justify-end">
                      <Button
                        className="bg-red-600 hover:bg-red-500"
                        onClick={deleteAdmin}
                      >
                        Да
                      </Button>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Нет
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}
