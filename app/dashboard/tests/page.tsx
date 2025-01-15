"use client"

import { useState, useEffect } from 'react';
import { Test } from '@/app/types/dashboard';
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";

const testTypeLabels = {
  'MALE_CHECKUP': 'Мужской чекап',
  'FEMALE_CHECKUP': 'Женский чекап'
};

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTests = async () => {
    try {
      const response = await fetch('https://checkapp-back.vercel.app/test/tests');
      const data = await response.json();
      setTests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ошибка при загрузке тестов:', error);
      setTests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-16" />
        ))}
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div className="container mx-auto space-y-6 mt-10">
        <h1 className="text-2xl font-bold">Тесты</h1>
        <p className="text-gray-500">Тестов пока нет</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 mt-10">
      <h1 className="text-2xl font-bold">Тесты</h1>
      <div className="grid gap-4">
        {tests.map((test) => (
          <div 
            key={test._id}
            className="p-4 border rounded-lg bg-white shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium">
                    {testTypeLabels[test.testType]}
                  </h3>
                  <Badge variant="destructive">Не оплачен</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Пользователь: {test.userName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {format(new Date(test.createdAt), 'd MMMM yyyy', { locale: ru })}
                </p>
                <p className="text-sm text-gray-500">
                  Время: {format(new Date(test.createdAt), 'HH:mm')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 