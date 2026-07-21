'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import { Badge } from '@/shared/ui/badge';

interface AuthenticationRecloudIDProps {
  onAuthenticated?: () => void;
}

export function AuthenticationRecloudID({ onAuthenticated }: AuthenticationRecloudIDProps) {
  const router = useRouter();

  // We no longer handle the callback here as it's now handled by the MarketplaceCallbackPage component
  useEffect(() => {
    // This component now only handles the initial authentication redirect
    // The callback is processed by the dedicated callback page
  }, []);

  const handleLogin = () => {
    // Redirect to RecloudID OAuth authorization endpoint
    const redirectUri = `${window.location.origin}/dashboard/marketplace/callback`;
    const authUrl = `https://oauth.recloud.tech/connect/authorize?response_type=code&client_id=GmlMarket&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email profile roles phone offline_access&state=42e4885a3fff07222f79e85d40a65293d9390a6c1bf078b4`;
    window.location.href = authUrl;
  };

  const features = [
    {
      title: 'Готовые сборки',
      description:
        'Используйте готовые решения от профессионалов для быстрого старта ваших проектов',
      icon: '📦',
    },
    {
      title: 'Продажа модулей',
      description: 'Монетизируйте свои разработки, продавая их другим пользователям платформы',
      icon: '💰',
    },
    {
      title: 'Пассивный доход',
      description: 'Получайте стабильный доход от продаж ваших модулей в маркетплейсе',
      icon: '💸',
    },
    {
      title: 'Сообщество разработчиков',
      description: 'Станьте частью активного сообщества и получайте обратную связь',
      icon: '👥',
    },
  ];

  const testimonials = [
    {
      name: 'Алексей К.',
      role: 'Senior Developer',
      content:
        'Благодаря маркетплейсу я смог монетизировать свои разработки и получать стабильный доход. Отличная платформа!',
      avatar: 'A',
    },
    {
      name: 'Мария С.',
      role: 'Product Manager',
      content:
        'Мы значительно ускорили разработку, используя готовые модули из маркетплейса. Экономия времени и ресурсов.',
      avatar: 'M',
    },
    {
      name: 'Дмитрий В.',
      role: 'Indie Developer',
      content:
        'Как независимый разработчик, я нашел здесь не только клиентов, но и единомышленников. Рекомендую!',
      avatar: 'D',
    },
  ];

  const faqItems = [
    {
      question: 'Как начать продавать свои модули?',
      answer:
        'Зарегистрируйтесь, создайте профиль разработчика, загрузите свой модуль, установите цену и опубликуйте его в маркетплейсе. Наша команда проверит модуль и после одобрения он станет доступен для покупки.',
    },
    {
      question: 'Какую комиссию берет платформа?',
      answer:
        'Стандартная комиссия составляет 15% от стоимости модуля. Для премиум-разработчиков доступны специальные условия с пониженной комиссией.',
    },
    {
      question: 'Как происходит выплата средств?',
      answer:
        'Выплаты производятся ежемесячно на указанные вами реквизиты. Минимальная сумма для вывода составляет 1000 рублей.',
    },
    {
      question: 'Могу ли я использовать модули в коммерческих проектах?',
      answer:
        'Да, все модули в маркетплейсе имеют лицензию, позволяющую использовать их в коммерческих проектах. Подробные условия указаны в описании каждого модуля.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-b">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center gap-4">
          <div className="space-y-3">
            <Badge className="px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              Новый маркетплейс модулей
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
              Маркетплейс модулей <span className="text-primary">Recloud</span>
            </h1>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px] mx-auto">
              Создавайте, продавайте и покупайте модули для ваших проектов. Экономьте время и
              зарабатывайте на своих разработках.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              size="lg"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground shadow hover:bg-primary/90"
              onClick={handleLogin}
            >
              <img
                src="data:image/svg+xml,%3csvg%20width='64'%20height='64'%20viewBox='0%200%2064%2064'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3ccircle%20cx='38.9032'%20cy='36.6216'%20r='19.7152'%20transform='rotate(-10.7156%2038.9032%2036.6216)'%20fill='%232F50C5'/%3e%3ccircle%20cx='23.5956'%20cy='22.5956'%20r='17.6257'%20transform='rotate(-10.7156%2023.5956%2022.5956)'%20fill='%235177FF'/%3e%3c/svg%3e"
                alt="recloud-tech-logo"
                className="w-5 h-5"
              />
              Войти через Recloud ID
            </Button>
            <Link
              target="_blank"
              href="https://nik497926.github.io/Gml.Docs/gml-marketplace.html"
            >
              <Button size="lg" variant="outline">
                Узнать больше
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm" style={{ color: '#FF6347' }}>
            * Для работы маркетплейса нужна подписка Gml Pro, поддержка HTTPS TLS 1.3 и
            предварительная регистрация, подробности в документации.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="outline" className="px-3 py-1 text-sm border-primary/20 text-primary">
                Возможности
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Всё, что вам нужно для успеха
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Наш маркетплейс предоставляет широкие возможности для разработчиков и пользователей
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
            {features.map((feature, index) => (
              <Card key={index} className="flex flex-col items-center text-center h-full">
                <CardHeader>
                  <div className="p-2 bg-primary/10 rounded-full mb-4 text-4xl">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="outline" className="px-3 py-1 text-sm border-primary/20 text-primary">
                Как это работает
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Начните зарабатывать на своих разработках
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Простой процесс от регистрации до получения прибыли
              </p>
            </div>
          </div>

          <Tabs defaultValue="sell" className="w-full max-w-4xl mx-auto mt-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sell">Продавать модули</TabsTrigger>
              <TabsTrigger value="buy">Покупать модули</TabsTrigger>
            </TabsList>
            <TabsContent value="sell" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-2">
                      1
                    </div>
                    <CardTitle>Создайте аккаунт</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Зарегистрируйтесь через Recloud ID и заполните профиль разработчика
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-2">
                      2
                    </div>
                    <CardTitle>Загрузите модуль</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Загрузите свой модуль, добавьте описание и установите цену
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-2">
                      3
                    </div>
                    <CardTitle>Получайте прибыль</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Каждая продажа приносит вам доход. Выводите средства ежемесячно
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="buy" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-2">
                      1
                    </div>
                    <CardTitle>Найдите модуль</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Используйте поиск и фильтры для нахождения нужного модуля
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-2">
                      2
                    </div>
                    <CardTitle>Оплатите покупку</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Выберите удобный способ оплаты и приобретите модуль
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-2">
                      3
                    </div>
                    <CardTitle>Используйте в проекте</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Интегрируйте модуль в свой проект и экономьте время разработки
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 ">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="outline" className="px-3 py-1 text-sm border-primary/20 text-primary">
                FAQ
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Часто задаваемые вопросы
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Ответы на популярные вопросы о маркетплейсе
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-3xl mt-8">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Готовы начать?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Присоединяйтесь к сообществу разработчиков и начните зарабатывать на своих модулях
                уже сегодня
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                size="lg"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground shadow hover:bg-primary/90"
                onClick={handleLogin}
              >
                <img
                  src="data:image/svg+xml,%3csvg%20width='64'%20height='64'%20viewBox='0%200%2064%2064'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3ccircle%20cx='38.9032'%20cy='36.6216'%20r='19.7152'%20transform='rotate(-10.7156%2038.9032%2036.6216)'%20fill='%232F50C5'/%3e%3ccircle%20cx='23.5956'%20cy='22.5956'%20r='17.6257'%20transform='rotate(-10.7156%2023.5956%2022.5956)'%20fill='%235177FF'/%3e%3c/svg%3e"
                  alt="recloud-tech-logo"
                  className="w-5 h-5"
                />
                Войти через Recloud ID
              </Button>

              <Link target="_blank" href="mailto:support@recloud.tech">
                <Button size="lg" variant="outline">
                  Связаться с нами
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
