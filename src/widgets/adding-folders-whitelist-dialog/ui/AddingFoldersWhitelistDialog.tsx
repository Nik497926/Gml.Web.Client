'use client';

import React, { useMemo, useState } from 'react';
import { ExclamationTriangleIcon, PlusIcon } from '@radix-ui/react-icons';
import { Folder, Trash2Icon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Input } from '@/shared/ui/input';
import { useAddingFolderWhitelist } from '@/shared/hooks';
import { ProfileExtendedBaseEntity } from '@/shared/api/contracts';
import {
  deriveFoldersFromFiles,
  normalizeWhitelistPath,
} from '@/shared/lib/normalizeWhitelistPath';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Checkbox } from '@/shared/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

interface AddingFoldersWhitelistDialogProps {
  profileName: string;
  profile: ProfileExtendedBaseEntity;
}

export const AddingFoldersWhitelistDialog = ({
  profileName,
  profile,
}: AddingFoldersWhitelistDialogProps) => {
  const { mutate } = useAddingFolderWhitelist();

  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen((prev) => !prev);

  const [tab, setTab] = useState('folders');
  const onChangeTab = (currentTab: string) => () => setTab(currentTab);

  const [customFolder, setCustomFolder] = useState('');
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [customAdded, setCustomAdded] = useState<string[]>([]);
  const [filter, setFilter] = useState('');

  const existingWhitelist = useMemo(
    () => new Set((profile.whiteListFolders ?? []).map((f) => normalizeWhitelistPath(f.path))),
    [profile.whiteListFolders],
  );

  const availableFolders = useMemo(() => {
    const fromFiles = deriveFoldersFromFiles(
      (profile.files ?? []).map((f) => f.directory),
      profileName,
    );
    return fromFiles.filter((f) => !existingWhitelist.has(f));
  }, [profile.files, profileName, existingWhitelist]);

  const filteredFolders = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return availableFolders;
    return availableFolders.filter((f) => f.toLowerCase().includes(q));
  }, [availableFolders, filter]);

  const selectedPaths = useMemo(() => {
    const fromList = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([path]) => normalizeWhitelistPath(path));
    return Array.from(new Set([...fromList, ...customAdded.map(normalizeWhitelistPath)])).filter(
      Boolean,
    );
  }, [selected, customAdded]);

  const handleAppendCustom = () => {
    const path = normalizeWhitelistPath(customFolder);
    if (!path) return;
    if (existingWhitelist.has(path)) return;
    setCustomAdded((prev) => (prev.includes(path) ? prev : [...prev, path]));
    setCustomFolder('');
  };

  const toggleFolder = (path: string, checked: boolean) => {
    setSelected((prev) => ({ ...prev, [path]: checked }));
  };

  const removeCustom = (path: string) => {
    setCustomAdded((prev) => prev.filter((p) => p !== path));
    setSelected((prev) => {
      const next = { ...prev };
      delete next[path];
      return next;
    });
  };

  const resetState = () => {
    setSelected({});
    setCustomAdded([]);
    setCustomFolder('');
    setFilter('');
    setTab('folders');
  };

  const onSubmit = () => {
    if (selectedPaths.length === 0) return;

    mutate(
      selectedPaths.map((path) => ({
        profileName,
        path,
      })),
    );

    resetState();
    onOpenChange();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetState();
        onOpenChange();
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-fit gap-2">
          <PlusIcon width={16} height={16} />
          Добавить папки
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1200px] max-h-[calc(100vh-theme(spacing.16))] overflow-auto">
        <DialogHeader>
          <DialogTitle>Добавление папок в «Белый список»</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="folders" value={tab}>
          <TabsContent value="folders" className="space-y-4">
            <Tabs defaultValue="from-list">
              <TabsList>
                <TabsTrigger value="from-list">Из загруженных</TabsTrigger>
                <TabsTrigger value="custom">Свой путь</TabsTrigger>
              </TabsList>

              <TabsContent value="from-list" className="space-y-3">
                <Input
                  placeholder="Поиск по папкам..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <ScrollArea className="h-72 rounded-md border">
                  <div className="p-2 space-y-1">
                    {filteredFolders.length === 0 && (
                      <p className="text-sm text-muted-foreground p-4 text-center">
                        Нет доступных папок. Сначала загрузите клиент или укажите путь вручную.
                      </p>
                    )}
                    {filteredFolders.map((folder) => (
                      <label
                        key={folder}
                        className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted cursor-pointer"
                      >
                        <Checkbox
                          checked={!!selected[folder]}
                          onCheckedChange={(v) => toggleFolder(folder, v === true)}
                        />
                        <Folder className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm break-all">{folder}</span>
                      </label>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="custom">
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Свой путь к папке</CardTitle>
                    <CardDescription>
                      Относительно каталога установки лаунчера, например{' '}
                      <code className="text-xs">game data/{profileName}/xaero</code> или коротко{' '}
                      <code className="text-xs">xaero</code> (внутри текущего профиля)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3">
                      <Input
                        placeholder={`game data/${profileName}/config`}
                        value={customFolder}
                        onChange={(e) => setCustomFolder(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAppendCustom();
                          }
                        }}
                      />
                      <Button onClick={handleAppendCustom} disabled={!customFolder.trim()}>
                        Добавить
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Будет исключена папка:{' '}
                      <span className="font-medium text-foreground break-all">
                        {'{каталог лаунчера}/'}
                        {normalizeWhitelistPath(customFolder) || '…'}
                      </span>
                    </p>
                    {customAdded.length > 0 && (
                      <ul className="space-y-1">
                        {customAdded.map((folder) => (
                          <li
                            key={folder}
                            className="flex items-center gap-2 rounded-md border px-2 py-1.5"
                          >
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => removeCustom(folder)}
                            >
                              <Trash2Icon size={14} />
                            </Button>
                            <span className="text-sm break-all">{folder}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="p-3 bg-muted/50 rounded-md border text-sm">
              Выбрано папок: <strong>{selectedPaths.length}</strong>
            </div>
          </TabsContent>

          <TabsContent value="checkout">
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Внимание!</AlertTitle>
              <AlertDescription>
                Вы выбрали <strong>{selectedPaths.length}</strong> папок(и), которые будут добавлены
                в WhiteList
              </AlertDescription>
            </Alert>
            <ScrollArea className="h-64 mt-4 rounded-md border">
              <ul className="p-3 space-y-1">
                {selectedPaths.map((path) => (
                  <li key={path} className="text-sm break-all py-1 border-b last:border-0">
                    {path}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-x-4">
          <Button className="w-fit" onClick={onChangeTab('folders')} disabled={tab === 'folders'}>
            Назад
          </Button>
          {tab === 'folders' && (
            <Button
              className="w-fit"
              onClick={onChangeTab('checkout')}
              disabled={selectedPaths.length === 0}
            >
              Далее
            </Button>
          )}
          {tab === 'checkout' && (
            <Button className="w-fit" onClick={onSubmit}>
              Добавить
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
