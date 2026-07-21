'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Ubuntu_Mono } from 'next/font/google';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ArrowBigDownDash, ChevronsUpDown, Package2Icon, Upload } from 'lucide-react';

import { useConnectionHub } from '../lib/useConnectionHub';

import { JavaVersionBaseEntity, ProfileExtendedBaseEntity, RestoreProfileSchemaType, } from '@/shared/api/contracts';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import { Textarea } from '@/shared/ui/textarea';
import { Icons } from '@/shared/ui/icons';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from '@/shared/ui/command';
import { Separator } from '@/shared/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import {
  useGetJavaRecommend,
  useGetJavaVersions,
  useGetProfileJavaMeta,
  useUploadProfileJava,
} from '@/shared/hooks/useProfiles';

interface DownloadClientHubProps {
  profile?: ProfileExtendedBaseEntity;
  isLoading?: boolean;
}

const ubuntuMono = Ubuntu_Mono({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: '400',
});

function formatJavaLabel(version: JavaVersionBaseEntity) {
  return `${version.name}@${version.version}`;
}

function parseJavaVersion(value?: string): JavaVersionBaseEntity | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as JavaVersionBaseEntity;
  } catch {
    return null;
  }
}

export function DownloadClientHub(props: DownloadClientHubProps) {
  const [javaVersionsOpen, setJavaVersionsOpen] = useState(false);
  const onOpenJavaVersionsChange = () => setJavaVersionsOpen((prev) => !prev);

  const {
    onDownloadDistributive,
    onDownloadJavaDistributive,
    onBuildDistributive,
    isDisable,
    isPacked,
    isConnected,
    percentStage,
    percentAllStages,
    logs,
  } = useConnectionHub(props);

  const javaVersions = useGetJavaVersions(props.profile?.minecraftVersion);
  const recommend = useGetJavaRecommend(props.profile?.minecraftVersion);
  const javaMeta = useGetProfileJavaMeta(props.profile?.profileName);
  const uploadJava = useUploadProfileJava();

  const azulVersions = useMemo(
    () =>
      (javaVersions.data ?? []).filter(
        (version) => version.source !== 'default' && version.version !== 'default',
      ),
    [javaVersions.data],
  );

  const form = useForm<RestoreProfileSchemaType>();
  const selectedJava = parseJavaVersion(form.watch('javaVersion'));

  const onSubmit: SubmitHandler<RestoreProfileSchemaType> = async (
    data: RestoreProfileSchemaType,
  ) => {
    if (!data.javaVersion) {
      onDownloadDistributive();
      return;
    }

    const selectedJavaVersion = JSON.parse(data.javaVersion) as JavaVersionBaseEntity;
    if (!selectedJavaVersion.source || selectedJavaVersion.source === 'default') {
      onDownloadDistributive();
      return;
    }

    onDownloadJavaDistributive(selectedJavaVersion);
  };

  const onUploadOwnJava = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !props.profile?.profileName) return;

    const response = await uploadJava.mutateAsync({
      profileName: props.profile.profileName,
      file,
    });

    const meta = response.data.data;
    const uploadedVersion: JavaVersionBaseEntity = {
      name: meta.name || file.name,
      version: meta.version || meta.runtimeId || 'custom',
      majorVersion: meta.javaMajor || 0,
      source: 'upload',
      recommended: false,
    };

    form.setValue('javaVersion', JSON.stringify(uploadedVersion));
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [logs]);

  const currentJavaPath = javaMeta.data?.javaPath || props.profile?.javaPath;

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <h5 className="flex items-center gap-x-3 text-xl font-bold">
          Управление
          {!isConnected && <sup className="text-xs text-gray-400">Подключение к консоли...</sup>}
        </h5>
        <div
          className="grid grid-rows-3 grid-cols-1 xl:grid-rows-2 xl:grid-cols-2 min-[1920px]:grid-cols-[400px_400px_1fr] min-[1920px]:grid-rows-1 gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col h-full rounded-lg border bg-card text-card-foreground shadow-sm p-6 gap-3">
                <div className="flex flex-col gap-y-1">
                  <h6 className="text-xl font-bold">Шаг первый</h6>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Необходимо загрузить клиент
                  </p>
                  {recommend.data && props.profile?.minecraftVersion && (
                    <p className="text-sm text-muted-foreground">
                      Для Minecraft {props.profile.minecraftVersion} рекомендуется Java{' '}
                      {recommend.data.majorVersion}
                      {recommend.data.label ? ` (${recommend.data.label})` : ''}
                    </p>
                  )}
                  {currentJavaPath && (
                    <p className="text-xs text-muted-foreground break-all">
                      Текущий runtime: {currentJavaPath}
                      {javaMeta.data?.source ? ` · ${javaMeta.data.source}` : ''}
                    </p>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="javaVersion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Выберите версию Java</FormLabel>
                      <FormControl>
                        <Popover open={javaVersionsOpen} onOpenChange={onOpenJavaVersionsChange}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full flex justify-between items-center"
                            >
                              <span className="truncate grow mr-2 text-start">
                                {selectedJava ? formatJavaLabel(selectedJava) : 'По умолчанию'}
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[320px] p-0">
                            <Command>
                              <CommandInput placeholder="Поиск версий..."/>
                              <CommandList>
                                <CommandEmpty>
                                  {javaVersions.isLoading ? 'Загрузка...' : 'Версия не найдена'}
                                </CommandEmpty>
                                <CommandGroup heading="По умолчанию">
                                  <CommandItem
                                    onSelect={() => {
                                      form.resetField('javaVersion');
                                      onOpenJavaVersionsChange();
                                    }}
                                  >
                                    <div className="flex flex-col gap-y-1">
                                      <span className="font-bold">По умолчанию</span>
                                      <span className="text-muted-foreground">
                                        Bootstrap Gml.Core
                                      </span>
                                    </div>
                                  </CommandItem>
                                </CommandGroup>
                                <Separator className="my-1"/>
                                <CommandGroup heading="Azul Zulu">
                                  {azulVersions.map((version, i) => (
                                    <CommandItem
                                      value={JSON.stringify(version)}
                                      key={`${version.packageUuid || version.name}-${version.version}-${i}`}
                                      onSelect={() => {
                                        field.onChange(JSON.stringify(version));
                                        onOpenJavaVersionsChange();
                                      }}
                                    >
                                      <div className="flex items-center gap-x-3 w-full">
                                        <span className="font-extrabold text-md min-w-6">
                                          {version.majorVersion}
                                        </span>
                                        <div className="flex flex-col gap-y-1 min-w-0 grow">
                                          <div className="flex items-center gap-x-2">
                                            <span className="font-bold truncate">{version.name}</span>
                                            {version.recommended && (
                                              <Badge variant="secondary" className="shrink-0">
                                                рек.
                                              </Badge>
                                            )}
                                          </div>
                                          <span className="text-muted-foreground truncate">
                                            {version.version}
                                            {version.os || version.arch
                                              ? ` · ${[version.os, version.arch].filter(Boolean).join('/')}`
                                              : ''}
                                          </span>
                                        </div>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-y-2">
                  <FormLabel>Загрузить свою Java</FormLabel>
                  <div className="flex gap-x-2">
                    <Input
                      type="file"
                      accept=".zip,.tar.gz,.tgz,application/zip,application/gzip,application/x-gzip,application/x-tar"
                      className="cursor-pointer"
                      disabled={
                        !props.profile?.profileName || uploadJava.isPending || isDisable || !isConnected
                      }
                      onChange={onUploadOwnJava}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Архив JDK (.zip / .tar.gz). После загрузки выберите «Загрузить» для restore.
                  </p>
                  {uploadJava.isPending && (
                    <p className="text-xs text-muted-foreground flex items-center gap-x-2">
                      <Icons.spinner className="h-3 w-3 animate-spin"/>
                      Распаковка JDK...
                    </p>
                  )}
                  {selectedJava?.source === 'upload' && (
                    <p className="text-xs text-muted-foreground flex items-center gap-x-1">
                      <Upload className="h-3 w-3"/>
                      Выбрана загруженная Java: {formatJavaLabel(selectedJava)}
                    </p>
                  )}
                </div>

                <div className="flex gap-x-2 mt-auto">
                  <Button
                    className="w-fit font-semibold"
                    disabled={
                      !isConnected ||
                      isDisable ||
                      !props.profile ||
                      !props.profile.hasUpdate ||
                      uploadJava.isPending
                    }
                  >
                    {isDisable && <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>}
                    <ArrowBigDownDash width={16} height={16} className="mr-2"/>
                    Загрузить
                  </Button>
                </div>
              </div>
            </form>
          </Form>

          <div className="flex flex-col rounded-lg text-card-foreground shadow-sm relative ">
            <div
              className="flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm justify-between p-6 gap-3 h-full">
              <div className="flex flex-col gap-y-1">
                <h6 className="text-xl font-bold">Шаг второй</h6>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Необходимо собрать профиль
                </p>
              </div>

              <Button
                className="w-fit"
                onClick={onBuildDistributive}
                disabled={!isConnected || isDisable || !props.profile || !props.profile.hasUpdate}
              >
                {isDisable && <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>}
                <Package2Icon width={16} height={16} className="mr-2"/>
                Собрать
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-y-4 col-span-1 xl:col-span-2 min-[1920px]:col-span-1">
            <Textarea
              ref={textareaRef}
              value={logs ? logs.join('\n') : ''}
              className={cn('h-80 max-h-80 font-sans', ubuntuMono.variable)}
              readOnly
            />
          </div>
        </div>

        {Boolean(isDisable) && Boolean(isPacked) && (
          <div className="grid gap-y-4">
            <div>
              <div className="flex flex-col">
                <div className="flex flex-col gap-y-2">
                  <div className="flex justify-between">
                    <span>{percentStage}%</span>
                    <span>Общий прогресс: {percentAllStages}%</span>
                  </div>
                  <div className="relative">
                    <Progress className="h-2 absolute opacity-70" value={percentStage}/>
                    <Progress className="h-2 absolute opacity-50" value={percentAllStages}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
