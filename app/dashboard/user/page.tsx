"use client"

import {getCookie} from "cookies-next";
import {useCallback, useEffect, useState} from "react";
import {User} from "@/app/types/dashboard";
import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Trash2, UserRound} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";

export default function UserPage() {
  const token = getCookie('jwt-token');

  const [users, setUsers] = useState<User[]>([]);
  const [currentId, setCurrentId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [openDeleteUser, setOpenDeleteUser] = useState(false);

  const getUsers = useCallback(async () => {
    const response = await fetch('/api/users/', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }).finally(() => {
      setIsLoading(false);
    });

    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  }, [token]);

  const deleteUser = useCallback(async () => {
    const response = await fetch('/api/users', {
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
      await getUsers();
      setOpenDeleteUser(false);
    }
  }, [currentId, getUsers, token]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <main className="container mx-auto pt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold">Пользователи</h1>
        {isLoading ? (
          <Skeleton className="w-16 h-4" />
          ) : (
          <h4>Количество: {users.length}</h4>
        )}
      </div>
      <div className="flex flex-col gap-y-2 mt-12">
        {isLoading ? (
          <Skeleton className="w-full h-12" />
        ) : (
          users.length > 0 ? (
            users.map((user) => (
              <div key={user._id} className="flex items-center justify-between w-full border-b pb-2">
        <div className="flex items-center gap-x-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-300">
            <UserRound className="w-6 h-6 text-white"/>
          </div>
          <p className="text-xl capitalize">{user.name}</p>
          <p className="text-xl capitalize">{user.email}</p>
        </div>
        <div className="flex items-center gap-x-1">
          <Dialog
            open={openDeleteUser}
            onOpenChange={setOpenDeleteUser}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setCurrentId(user._id);
                }}
              >
                <Trash2 className="w-4 h-4"/>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Вы уверены что хотите удалить пользователя ?</DialogTitle>
                <DialogDescription>
                  После удаления данного данного пользователя все данные будут утеряны
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="justify-end">
                <Button
                  className="bg-red-600 hover:bg-red-500"
                  onClick={deleteUser}
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
          ) : (
            <div className="flex items-center justify-center">
        <h1 className="font-semibold text-xl">Список пользователей пуст!</h1>
      </div>
          )
        )}
      </div>
    </main>
)
}
