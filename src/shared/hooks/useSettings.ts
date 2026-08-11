import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { TPutSettingsPlatformRequest, TTestSettingsS3Request } from '@/shared/api/contracts';
import { settingsService } from '@/shared/services/SettingsService';
import { isAxiosError } from '@/shared/lib/isAxiosError/isAxiosError';

export const useSettingsPlatform = () => {
  return useQuery({
    queryKey: ['settings-platform'],
    queryFn: () => settingsService.getPlatform(),
    select: ({ data }) => data.data,
  });
};

export const useEditSettingsPlatform = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['edit-settings-platform'],
    mutationFn: (data: TPutSettingsPlatformRequest) => settingsService.editPlatform(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['settings-platform'] });
      toast.success('Успешно', {
        description: `Настройки платформы успешно обновлены`,
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error });
    },
  });
};

export const useTestSettingsS3 = () => {
  return useMutation({
    mutationKey: ['test-settings-s3'],
    mutationFn: (data: TTestSettingsS3Request) => settingsService.testS3(data),
    onSuccess: (response) => {
      toast.success('Успешно', {
        description: response.data.message || 'Соединение с S3 установлено',
      });
    },
    onError: (error) => {
      isAxiosError({ toast, error, customDescription: 'Не удалось подключиться к S3' });
    },
  });
};
