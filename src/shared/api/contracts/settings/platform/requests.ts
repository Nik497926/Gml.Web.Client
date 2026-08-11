import { SettingsPlatformBaseEntity } from '@/shared/api/contracts';
import { ResponseBaseEntity } from '@/shared/api/schemas';
import { StorageType } from '@/shared/enums';

// Получение активного сервиса авторизации
export type TGetSettingsPlatformRequest = {};
export type TGetSettingsPlatformResponse = ResponseBaseEntity & {
  data: SettingsPlatformBaseEntity;
};

// Изменение сервера авторизации
export type TPutSettingsPlatformRequest = {
  registrationIsEnabled: boolean;
  storageType: StorageType;
  curseForgeKey: string;
  vkKey: string;
  storageHost: string;
  storageLogin: string;
  storagePassword: string;
  textureProtocol: number;
  // Sentry auto-clear settings (TimeSpan serialized as string, e.g., "00:05:00", "1.00:00:00")
  sentryNeedAutoClear: boolean;
  sentryAutoClearPeriod: string;
  /** optional — если не передать, сервер не меняет режим токенов Unicore */
  unicoreUseExternalTokens?: boolean;
};
export type TPutSettingsPlatformResponse = ResponseBaseEntity & {};

export type TPutUnicoreTokensRequest = {
  useExternalTokens: boolean;
};
export type TPutUnicoreTokensResponse = ResponseBaseEntity & {
  data: { useExternalTokens: boolean };
};

export type TTestSettingsS3Request = {
  storageHost: string;
  storageLogin: string;
  storagePassword: string;
};
export type TTestSettingsS3Response = ResponseBaseEntity & {};
