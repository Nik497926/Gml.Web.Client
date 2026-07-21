'use client';

import { useMemo, useState } from 'react';
import {
  ArchiveIcon,
  ArrowUpIcon,
  DownloadIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  PencilIcon,
  RefreshCwIcon,
  Trash2Icon,
} from 'lucide-react';
import { toast } from 'sonner';
import { isAxiosError as isAxiosErrorBase } from 'axios';

import {
  FileManagerEntryEntity,
  FileManagerScope,
} from '@/shared/api/contracts/file-manager/schemas';
import {
  useArchiveFileManagerEntries,
  useDeleteFileManagerEntries,
  useExtractFileManagerArchive,
  useFileManagerEntries,
  useWriteFileManagerContent,
} from '@/shared/hooks/useFileManager';
import { isAxiosError } from '@/shared/lib/isAxiosError/isAxiosError';
import { fileManagerService } from '@/shared/services/FileManagerService';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { cn } from '@/shared/lib/utils';

type FileManagerProps = {
  scope: FileManagerScope;
  profileName?: string;
};

const formatSize = (size: number, isDirectory: boolean) => {
  if (isDirectory) return '—';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (value: string) => {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

const parentPath = (path: string) => {
  if (!path) return '';
  const parts = path.replace(/\\/g, '/').split('/').filter(Boolean);
  parts.pop();
  return parts.join('/');
};

export function FileManager({ scope, profileName }: FileManagerProps) {
  const [currentPath, setCurrentPath] = useState('');
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorPath, setEditorPath] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorLoading, setEditorLoading] = useState(false);
  const [archiveName, setArchiveName] = useState('archive.zip');

  const { data: entries = [], isFetching, refetch, isError, error } = useFileManagerEntries(
    scope,
    currentPath,
    profileName,
  );

  const writeMutation = useWriteFileManagerContent();
  const deleteMutation = useDeleteFileManagerEntries();
  const archiveMutation = useArchiveFileManagerEntries();
  const extractMutation = useExtractFileManagerArchive();

  const selectedPaths = useMemo(
    () => Object.entries(selected).filter(([, v]) => v).map(([path]) => path),
    [selected],
  );

  const selectedEntries = useMemo(
    () => entries.filter((entry) => selected[entry.relativePath]),
    [entries, selected],
  );

  const breadcrumbs = useMemo(() => {
    const parts = currentPath ? currentPath.split('/').filter(Boolean) : [];
    const crumbs: { label: string; path: string }[] = [{ label: 'Корень', path: '' }];
    let acc = '';
    for (const part of parts) {
      acc = acc ? `${acc}/${part}` : part;
      crumbs.push({ label: part, path: acc });
    }
    return crumbs;
  }, [currentPath]);

  const toggleSelect = (path: string, checked: boolean) => {
    setSelected((prev) => ({ ...prev, [path]: checked }));
  };

  const toggleSelectAll = (checked: boolean) => {
    if (!checked) {
      setSelected({});
      return;
    }
    const next: Record<string, boolean> = {};
    for (const entry of entries) {
      next[entry.relativePath] = true;
    }
    setSelected(next);
  };

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    setSelected({});
  };

  const openEntry = async (entry: FileManagerEntryEntity) => {
    if (entry.isDirectory) {
      navigateTo(entry.relativePath);
      return;
    }

    setEditorLoading(true);
    setEditorPath(entry.relativePath);
    setEditorOpen(true);
    try {
      const { data } = await fileManagerService.readContent({
        scope,
        path: entry.relativePath,
        profileName,
      });
      if (data.data.isBinary) {
        toast.error('Бинарный файл', {
          description: 'Редактирование недоступно. Используйте скачивание.',
        });
        setEditorOpen(false);
        return;
      }
      setEditorContent(data.data.content ?? '');
    } catch (err) {
      setEditorOpen(false);
      if (isAxiosErrorBase(err) && err.response?.status === 415) {
        toast.error('Бинарный файл', {
          description: 'Редактирование недоступно. Используйте скачивание.',
        });
        return;
      }
      isAxiosError({ toast, error: err as Error });
    } finally {
      setEditorLoading(false);
    }
  };

  const handleSave = () => {
    writeMutation.mutate(
      {
        scope,
        path: editorPath,
        profileName,
        content: editorContent,
      },
      {
        onSuccess: () => setEditorOpen(false),
      },
    );
  };

  const handleDownload = async () => {
    const files = selectedEntries.filter((e) => !e.isDirectory);
    if (files.length === 0) {
      toast.error('Выберите файл для скачивания');
      return;
    }
    try {
      for (const file of files) {
        await fileManagerService.download({
          scope,
          path: file.relativePath,
          profileName,
        });
      }
    } catch (err) {
      isAxiosError({ toast, error: err as Error });
    }
  };

  const handleArchive = () => {
    if (selectedPaths.length === 0) {
      toast.error('Выберите файлы или папки');
      return;
    }
    archiveMutation.mutate({
      scope,
      profileName,
      paths: selectedPaths,
      archiveName: archiveName || 'archive.zip',
    });
  };

  const handleExtract = () => {
    const zip = selectedEntries.find(
      (e) => !e.isDirectory && e.name.toLowerCase().endsWith('.zip'),
    );
    if (!zip) {
      toast.error('Выберите .zip архив');
      return;
    }
    extractMutation.mutate({
      scope,
      profileName,
      path: zip.relativePath,
    });
  };

  const handleDelete = () => {
    if (selectedPaths.length === 0) return;
    deleteMutation.mutate(
      {
        scope,
        profileName,
        paths: selectedPaths,
      },
      {
        onSuccess: () => setSelected({}),
      },
    );
  };

  const allSelected = entries.length > 0 && selectedPaths.length === entries.length;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!currentPath}
          onClick={() => navigateTo(parentPath(currentPath))}
        >
          <ArrowUpIcon className="mr-1 h-4 w-4" />
          Вверх
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCwIcon className={cn('mr-1 h-4 w-4', isFetching && 'animate-spin')} />
          Обновить
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={selectedEntries.every((e) => e.isDirectory) || selectedPaths.length === 0}
          onClick={handleDownload}
        >
          <DownloadIcon className="mr-1 h-4 w-4" />
          Скачать
        </Button>
        <div className="flex items-center gap-2">
          <Input
            className="h-8 w-36"
            value={archiveName}
            onChange={(e) => setArchiveName(e.target.value)}
            placeholder="archive.zip"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={selectedPaths.length === 0 || archiveMutation.isPending}
            onClick={handleArchive}
          >
            <ArchiveIcon className="mr-1 h-4 w-4" />
            В архив
          </Button>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={
            !selectedEntries.some((e) => !e.isDirectory && e.name.toLowerCase().endsWith('.zip')) ||
            extractMutation.isPending
          }
          onClick={handleExtract}
        >
          <FolderOpenIcon className="mr-1 h-4 w-4" />
          Распаковать
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={selectedPaths.length === 0 || deleteMutation.isPending}
            >
              <Trash2Icon className="mr-1 h-4 w-4" />
              Удалить
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удаление</AlertDialogTitle>
              <AlertDialogDescription>
                Удалить выбранные элементы ({selectedPaths.length})? Это действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.path || 'root'} className="flex items-center gap-1">
            {index > 0 && <span>/</span>}
            <button
              type="button"
              className="hover:text-foreground hover:underline"
              onClick={() => navigateTo(crumb.path)}
            >
              {crumb.label}
            </button>
          </span>
        ))}
      </div>

      {isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {(error as Error)?.message || 'Не удалось загрузить список файлов'}
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_120px_180px_88px] gap-2 border-b bg-muted/40 px-3 py-2 text-xs font-medium">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(value) => toggleSelectAll(Boolean(value))}
            aria-label="Выбрать все"
          />
          <span>Имя</span>
          <span>Размер</span>
          <span>Изменён</span>
          <span />
        </div>
        <div className="max-h-[560px] overflow-auto">
          {entries.length === 0 && !isFetching && (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">Папка пуста</div>
          )}
          {entries.map((entry) => (
            <div
              key={entry.relativePath}
              className="grid grid-cols-[40px_1fr_120px_180px_88px] gap-2 border-b px-3 py-2 text-sm hover:bg-muted/30"
            >
              <Checkbox
                checked={Boolean(selected[entry.relativePath])}
                onCheckedChange={(value) => toggleSelect(entry.relativePath, Boolean(value))}
                aria-label={`Выбрать ${entry.name}`}
              />
              <button
                type="button"
                className="flex items-center gap-2 text-left hover:underline truncate"
                onClick={() => openEntry(entry)}
              >
                {entry.isDirectory ? (
                  <FolderIcon className="h-4 w-4 shrink-0 text-amber-500" />
                ) : (
                  <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <span className="truncate">{entry.name}</span>
              </button>
              <span className="text-muted-foreground">
                {formatSize(entry.size, entry.isDirectory)}
              </span>
              <span className="text-muted-foreground truncate">
                {formatDate(entry.modifiedAt)}
              </span>
              <div className="flex justify-end">
                {!entry.isDirectory && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => openEntry(entry)}
                    title="Открыть / редактировать"
                  >
                    <PencilIcon className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Клик по папке — вход. Клик по файлу или иконка карандаша — открыть и сохранить (текст до
        2&nbsp;MB). Бинарники только скачиваются. data.db скрыт и защищён.
      </p>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate">{editorPath || 'Файл'}</DialogTitle>
          </DialogHeader>
          {editorLoading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">Загрузка...</div>
          ) : (
            <Textarea
              className="min-h-[360px] font-mono text-xs"
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
            />
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditorOpen(false)}>
              Отмена
            </Button>
            <Button
              type="button"
              disabled={editorLoading || writeMutation.isPending}
              onClick={handleSave}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
