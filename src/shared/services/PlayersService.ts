import { $api } from '@/services/api.service';
import {
  TGetPlayersRequest,
  TGetPlayersResponse,
  TGetUnicorePlayerCabinetResponse,
  TPostBanPlayersRequest,
  TPostBanPlayersResponse,
  TPostBanPlayersOptions,
  TPostPardonPlayersOptions,
} from '@/shared/api/contracts';

class PlayersService {
  private BASE_URL = '/players';

  async getPlayers(params: TGetPlayersRequest): Promise<TGetPlayersResponse> {
    const { data } = await $api.get<TGetPlayersResponse>(this.BASE_URL, {
      params,
    });

    return data;
  }

  async getUnicoreCabinet(uuid: string): Promise<TGetUnicorePlayerCabinetResponse> {
    const { data } = await $api.get<TGetUnicorePlayerCabinetResponse>(
      `${this.BASE_URL}/${encodeURIComponent(uuid)}/unicore`,
    );
    return data;
  }

  async banPlayer(body: TPostBanPlayersRequest, options?: TPostBanPlayersOptions): Promise<TPostBanPlayersResponse> {
    const { data } = await $api.post<TPostBanPlayersResponse>(
      `${this.BASE_URL}/ban${options?.deviceBlock ? '?deviceBlock=true' : ''}`,
      body,
    );

    return data;
  }

  async pardonPlayer(
    body: TPostBanPlayersRequest,
    options?: TPostPardonPlayersOptions,
  ): Promise<TPostBanPlayersResponse> {
    const { data } = await $api.post<TPostBanPlayersResponse>(
      `${this.BASE_URL}/pardon${options?.deviceUnblock ? '?deviceUnblock=true' : ''}`,
      body,
    );

    return data;
  }

  async removePlayer(body: TPostBanPlayersRequest): Promise<TPostBanPlayersResponse> {
    const { data } = await $api.post<TPostBanPlayersResponse>(`${this.BASE_URL}/remove`, body);

    return data;
  }
}

export const playersService = new PlayersService();
