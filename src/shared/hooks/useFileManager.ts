import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  FileManagerScope,
  TPostFileManagerArchiveRequest,
  TPostFileManagerDeleteRequest,
  TPostFileManagerExtractRequest,
  TPutFileManagerContentRequest,
} from '@/shared/api/contracts/file-manager/schemas';
import { isAxiosError } from '@/shared/lib/isAxiosError/isAxiosError';
import { fileManagerService } from '@/shared/services/FileManagerService';

export const fileManagerKeys = {
  all: ['file-manager'] as const,
  entries: (scope: FileManagerScope, path: string, profileName?: string) =>
    [...fileManagerKeys.all, 'entries', scope, path, profileName ?? ''] as const,
};

export const useFileManagerEntries = (
  scope: FileManagerScope,
  path: string,
  profileName?: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: fileManagerKeys.entries(scope, path, profileName),
    queryFn: () =>
      fileManagerService.listEntries({
        scope,
        path: path || undefined,
        profileName,
      }),
    select: ({ data }) => data.data,
    enabled,
  });
};

export const useWriteFileManagerContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['file-manager-write'],
    mutationFn: (body: TPutFileManagerContentRequest) => fileManagerService.writeContent(body),
    onSuccess: () => {
      toast.success('Успешно', { description: 'Файл сохранён' });
      queryClient.invalidateQueries({ queryKey: fileManagerKeys.all });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useDeleteFileManagerEntries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['file-manager-delete'],
    mutationFn: (body: TPostFileManagerDeleteRequest) => fileManagerService.deleteEntries(body),
    onSuccess: () => {
      toast.success('Успешно', { description: 'Удаление выполнено' });
      queryClient.invalidateQueries({ queryKey: fileManagerKeys.all });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useArchiveFileManagerEntries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['file-manager-archive'],
    mutationFn: (body: TPostFileManagerArchiveRequest) => fileManagerService.archive(body),
    onSuccess: () => {
      toast.success('Успешно', { description: 'Архив создан' });
      queryClient.invalidateQueries({ queryKey: fileManagerKeys.all });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useExtractFileManagerArchive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['file-manager-extract'],
    mutationFn: (body: TPostFileManagerExtractRequest) => fileManagerService.extract(body),
    onSuccess: () => {
      toast.success('Успешно', { description: 'Архив распакован' });
      queryClient.invalidateQueries({ queryKey: fileManagerKeys.all });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};
