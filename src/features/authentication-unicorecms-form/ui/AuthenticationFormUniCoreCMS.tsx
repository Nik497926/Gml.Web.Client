'use client';

import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { IntegrationFormSchemaType, integrationSchema } from '../lib/static';

import {
  useEditIntegration,
  useEditUnicoreTokens,
  useGetActiveAuthIntegrations,
  useSettingsPlatform,
} from '@/shared/hooks';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Icons } from '@/shared/ui/icons';
import { Input } from '@/shared/ui/input';
import { Switch } from '@/shared/ui/switch';
import { AuthenticationType } from '@/shared/enums';

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onOpenChange: (open: boolean) => void;
}

export function AuthenticationFormUniCoreCMS({
  className,
  onOpenChange,
  ...props
}: SignInFormProps) {
  const { data: integration } = useGetActiveAuthIntegrations();
  const { data: platform } = useSettingsPlatform();
  const { mutateAsync, isPending } = useEditIntegration();
  const { mutateAsync: saveUnicoreTokens, isPending: isSavingTokens } = useEditUnicoreTokens();

  const [useExternalTokens, setUseExternalTokens] = React.useState(true);

  React.useEffect(() => {
    if (platform) {
      setUseExternalTokens(platform.unicoreUseExternalTokens ?? true);
    }
  }, [platform]);

  const form = useForm<IntegrationFormSchemaType>({
    values: {
      endpoint:
        integration?.authType === AuthenticationType.AUTHENTICATION_TYPE_UNICORECMS
          ? String(integration.endpoint)
          : '',
      authType:
        integration?.authType === AuthenticationType.AUTHENTICATION_TYPE_UNICORECMS
          ? integration.authType
          : AuthenticationType.AUTHENTICATION_TYPE_UNICORECMS,
    },
    resolver: zodResolver(integrationSchema),
  });

  const tokensDirty = (platform?.unicoreUseExternalTokens ?? true) !== useExternalTokens;

  const onSubmit: SubmitHandler<IntegrationFormSchemaType> = async (
    data: IntegrationFormSchemaType,
  ) => {
    if (tokensDirty) {
      await saveUnicoreTokens({ useExternalTokens });
    }

    await mutateAsync(data).then(() => {
      onOpenChange(false);
    });
  };

  return (
    <div className={cn('grid gap-4', className)} {...props}>
      <Form {...form}>
        <form className="flex flex-col space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormItem>
            <FormLabel>Введите ссылку на Ваш Backend</FormLabel>
            <FormControl>
              <Input placeholder="Введите ссылку на Ваш Backend" {...form.register('endpoint')} />
            </FormControl>
            {form.formState.errors.endpoint && (
              <FormMessage>{form.formState.errors.endpoint.message}</FormMessage>
            )}
          </FormItem>

          <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-3">
            <div className="space-y-1">
              <FormLabel className="text-sm font-medium">
                Токены Unicore ({useExternalTokens ? 'Вкл' : 'Выкл'})
              </FormLabel>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Включено — AccessToken игрока из Unicore. Выключено — JWT Gml; наигранное время и
                кабинет читаются через сохранённый Unicore refresh (нужен вход через лаунчер после
                смены режима).
              </p>
            </div>
            <FormControl>
              <Switch checked={useExternalTokens} onCheckedChange={setUseExternalTokens} />
            </FormControl>
          </FormItem>

          <Button
            type="submit"
            className="w-fit ml-auto"
            disabled={isPending || isSavingTokens || (!form.formState.isDirty && !tokensDirty)}
          >
            {(isPending || isSavingTokens) && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Сохранить
          </Button>
        </form>
      </Form>
    </div>
  );
}
