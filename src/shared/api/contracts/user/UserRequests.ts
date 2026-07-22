import { PlayerBaseEntity, UserBaseEntity } from '@/shared/api/contracts';
import { ResponseBaseEntity } from '@/shared/api/schemas';

// Регистрация
export type TPostSignUpRequest = {
  login: string;
  password: string;
  email: string;
};
export type TPostSignUpResponse = ResponseBaseEntity & {
  data: UserBaseEntity & {
    accessToken: string;
  };
};

// Авторизация
export type ApiPostSignInRequest = {
  login: string;
  password: string;
};
export type ApiPostSignInResponse = ResponseBaseEntity & {
  data: {
    accessToken: string;
    expiresIn: number;
  };
};

// Игроки
export type TGetPlayersRequest = {
  take: number;
  offset: number;
  findName?: string;
  findUuid?: string;
  findIp?: string;
  findHwid?: string;
  onlyBlocked?: boolean;
  onlyDeviceBlocked?: boolean;
  sortBy?: 0 | 1 | 2;
  sortDesc?: boolean;
};
export type TGetPlayersResponse = ResponseBaseEntity & {
  data: PlayerBaseEntity[];
};

export type UnicoreDonateGroupEntity = {
  name: string;
  ingameId?: string | null;
  expired?: string | null;
};

export type UnicorePlayerServerEntity = {
  serverId: string;
  serverName: string;
  playtime: number;
  donateGroups: UnicoreDonateGroupEntity[];
};

export type UnicorePlayerCabinetEntity = {
  available: boolean;
  message?: string | null;
  servers: UnicorePlayerServerEntity[];
};

export type TGetUnicorePlayerCabinetResponse = ResponseBaseEntity & {
  data: UnicorePlayerCabinetEntity;
};

// Бан юзера
export type TPostBanPlayersRequest = string[];
export type TPostBanPlayersOptions = { deviceBlock?: boolean };
export type TPostBanPlayersResponse = ResponseBaseEntity & {};

// Разбан юзера
export type TPostPardonPlayersOptions = { deviceUnblock?: boolean };

// Удаление юзера
export type TPostRemovePlayersRequest = string[];
export type TPostRemovePlayersResponse = ResponseBaseEntity & {};
