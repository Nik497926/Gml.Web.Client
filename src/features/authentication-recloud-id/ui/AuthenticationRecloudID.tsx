'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { setStorageRecloudIDAccessToken } from '@/shared/services';
import { getMarketplaceSiteUrl } from '@/shared/lib/marketplace-url';

interface AuthenticationRecloudIDProps {
  onAuthenticated?: () => void;
}

export function AuthenticationRecloudID({ onAuthenticated }: AuthenticationRecloudIDProps) {
  const [apiKey, setApiKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const marketplaceSiteUrl = getMarketplaceSiteUrl();

  const handleOpenMarketplace = () => {
    if (!marketplaceSiteUrl) {
      toast.error('Маркетплейс не настроен', {
        description: 'Укажите NEXT_PUBLIC_MARKETPLACE_URL (сайт) в .env',
      });
      return;
    }

    window.open(marketplaceSiteUrl, '_blank', 'noopener,noreferrer');
  };

  const handleConnect = async () => {
    const key = apiKey.trim();
    if (!key) {
      toast.error('Введите ключ', {
        description: 'Скопируйте API-ключ с сайта маркетплейса и вставьте сюда',
      });
      return;
    }

    setIsConnecting(true);
    try {
      setStorageRecloudIDAccessToken(key);
      toast.success('Ключ сохранён', {
        description: 'Проверяем доступ к маркетплейсу…',
      });
      onAuthenticated?.();
    } finally {
      setIsConnecting(false);
    }
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

  const faqItems = [
    {
      question: 'Как получить ключ маркетплейса?',
      answer:
        'Откройте сайт маркетплейса, зарегистрируйтесь, добавьте проект с URL вашего Gml Backend. После проверки доступности backend сайт выдаст ключ — вставьте его в поле ниже.',
    },
    {
      question: 'Как начать продавать свои модули?',
      answer:
        'На сайте маркетплейса создайте профиль разработчика, загрузите модуль, установите цену и опубликуйте. После проверки модуль станет доступен для покупки.',
    },
    {
      question: 'Какую комиссию берет платформа?',
      answer:
        'Стандартная комиссия составляет 15% от стоимости модуля. Для премиум-разработчиков доступны специальные условия с пониженной комиссией.',
    },
    {
      question: 'Могу ли я использовать модули в коммерческих проектах?',
      answer:
        'Да, все модули в маркетплейсе имеют лицензию, позволяющую использовать их в коммерческих проектах. Подробные условия указаны в описании каждого модуля.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 border-b">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center gap-4">
          <div className="space-y-3">
            <Badge className="px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              Маркетплейс модулей
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
              Подключите маркетплейс по ключу
            </h1>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px] mx-auto">
              Зарегистрируйтесь на сайте маркетплейса, добавьте проект и вставьте выданный API-ключ
              сюда — каталог и установка модулей откроются в панели.
            </p>
          </div>

          <Card className="w-full max-w-lg mt-6 text-left">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Подключение
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Откройте сайт маркетплейса и создайте аккаунт</li>
                <li>Добавьте проект с адресом вашего Gml Backend</li>
                <li>Скопируйте выданный ключ и вставьте ниже</li>
              </ol>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={handleOpenMarketplace}
              >
                <ExternalLink className="h-4 w-4" />
                Перейти на сайт маркетплейса
              </Button>

              <div className="space-y-2">
                <label htmlFor="marketplace-api-key" className="text-sm font-medium">
                  API-ключ
                </label>
                <Input
                  id="marketplace-api-key"
                  type="password"
                  autoComplete="off"
                  placeholder="Вставьте ключ с сайта маркетплейса"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void handleConnect();
                    }
                  }}
                />
              </div>

              <Button
                type="button"
                className="w-full"
                disabled={isConnecting || !apiKey.trim()}
                onClick={() => void handleConnect()}
              >
                {isConnecting ? 'Подключение…' : 'Подключить ключ'}
              </Button>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              target="_blank"
              href="https://nik497926.github.io/Gml.Docs/gml-marketplace.html"
            >
              <Button size="lg" variant="outline">
                Узнать больше
              </Button>
            </Link>
          </div>
          <p className="mt-2 text-sm text-muted-foreground max-w-[640px]">
            Для работы маркетплейса нужна подписка Gml Pro, поддержка HTTPS и доступность вашего
            backend с сайта маркета (проверка через{' '}
            <code className="text-xs">/api/v1/marketplace/bridge</code>).
          </p>
        </div>
      </section>

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
                Маркетплейс предоставляет широкие возможности для разработчиков и пользователей
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

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="outline" className="px-3 py-1 text-sm border-primary/20 text-primary">
                Как это работает
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                От сайта маркета до установки в панели
              </h2>
            </div>
          </div>

          <Tabs defaultValue="connect" className="w-full max-w-4xl mx-auto mt-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="connect">Подключить каталог</TabsTrigger>
              <TabsTrigger value="sell">Продавать модули</TabsTrigger>
            </TabsList>
            <TabsContent value="connect" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-2">
                      1
                    </div>
                    <CardTitle>Сайт маркетплейса</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Зарегистрируйтесь и добавьте проект с URL вашего Gml Backend
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-2">
                      2
                    </div>
                    <CardTitle>Получите ключ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Сайт проверит доступность backend и выдаст API-ключ проекта
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-2">
                      3
                    </div>
                    <CardTitle>Вставьте в панель</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Подключите ключ здесь — каталог и установка модулей станут доступны
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="sell" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-2">
                      1
                    </div>
                    <CardTitle>Профиль разработчика</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      На сайте маркетплейса заполните профиль и загрузите модуль
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-2">
                      2
                    </div>
                    <CardTitle>Публикация</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Укажите описание и цену — после проверки модуль появится в каталоге
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-2">
                      3
                    </div>
                    <CardTitle>Продажи</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Получайте доход с продаж и выводите средства по правилам платформы
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="outline" className="px-3 py-1 text-sm border-primary/20 text-primary">
                FAQ
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Часто задаваемые вопросы
              </h2>
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

      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Готовы подключить?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Получите ключ на сайте маркетплейса и вставьте его в форму выше
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button size="lg" className="gap-2" onClick={handleOpenMarketplace}>
                <ExternalLink className="h-4 w-4" />
                Открыть маркетплейс
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
