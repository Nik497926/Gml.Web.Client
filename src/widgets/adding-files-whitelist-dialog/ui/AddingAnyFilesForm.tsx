'use client';

import { useState } from 'react';
import { Folder } from 'lucide-react';
import { PlusIcon } from '@radix-ui/react-icons';

import { FormControl, FormDescription, FormItem, FormLabel } from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useFilesListStore } from '@/widgets/adding-files-whitelist-dialog/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { normalizeWhitelistPath } from '@/shared/lib/normalizeWhitelistPath';

export function AddingAnyFilesForm({ profile }: { profile: string }) {
  const { addDirectory } = useFilesListStore();

  const [value, setValue] = useState<string | undefined>(undefined);
  const onChangeValue = (directory: string) => {
    setValue(directory);
  };

  const onAddDirectoriesCollection = () => {
    if (!value?.trim()) return;

    const directory = {
      profileName: profile,
      directory: normalizeWhitelistPath(value),
    };

    addDirectory(directory);
    setValue('');
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Добавление своего файла в белый список</CardTitle>
        <CardDescription>
          Укажите путь относительно каталога установки лаунчера, например{' '}
          <code className="text-xs">game data/beta/options.txt</code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormItem className="space-y-2">
          <FormLabel className="text-sm font-medium">Путь к файлу</FormLabel>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Folder className="h-4 w-4" />
              </div>
              <FormControl>
                <Input
                  placeholder="game data/beta/options.txt"
                  value={value || ''}
                  onChange={(event) => onChangeValue(event.target.value)}
                  className="pl-9 focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </FormControl>
            </div>
            <Button
              onClick={onAddDirectoriesCollection}
              className="gap-1.5"
              disabled={!value?.trim()}
            >
              <PlusIcon className="h-4 w-4" />
              Добавить
            </Button>
          </div>
          <FormDescription className="mt-3 p-3 bg-muted/50 rounded-md border text-sm">
            Будет исключен файл:{' '}
            <span className="font-medium text-primary block mt-1 break-all">
              {value
                ? `{каталог лаунчера}/${normalizeWhitelistPath(value)}`
                : '—'}
            </span>
          </FormDescription>
        </FormItem>
      </CardContent>
    </Card>
  );
}
