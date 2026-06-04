import { SetMetadata } from '@nestjs/common';
import { ICacheableOptions } from '../types';

export const CACHE_KEY_METADATA = 'cache:key';
export const CACHE_TTL_METADATA = 'cache:ttl';

export const Cacheable = (options: ICacheableOptions) => {
    return SetMetadata(CACHE_KEY_METADATA, options);
};
