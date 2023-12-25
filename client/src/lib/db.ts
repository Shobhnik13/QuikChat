import { Redis } from '@upstash/redis'

export const db = new Redis({
    url:'https://us1-mint-mollusk-37688.upstash.io',
    token:'AZM4ASQgYmY0MTNjOTAtMWI2ZS00NzA1LWFhMWEtMGM2NjZhNmUyMjhhODU5NWFjNGMzYzAwNGZjYTk3NTQwM2UzNDc4MDM1ODI=',
  });

  