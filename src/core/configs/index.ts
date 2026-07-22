import packageJson from '../../../package.json';

export const BRAND_NAME = 'Gml';
export const PLATFORM_SHORT_APP_NAME = 'Panel';
export const PLATFORM_APP_NAME = `${BRAND_NAME} ${PLATFORM_SHORT_APP_NAME}`;

export const PLATFORM_VERSION = `${packageJson.version}`;
export const PLATFORM_CREDIT = 'by S.One';

type Config = {
  version: string;
  name: string;
  credit: string;
};

export const config: Config = {
  version: PLATFORM_VERSION,
  name: PLATFORM_APP_NAME,
  credit: PLATFORM_CREDIT,
};
