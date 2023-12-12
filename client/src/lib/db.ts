import { Redis } from '@upstash/redis'

export const db = new Redis({
    url:'https://us1-aware-boxer-41150.upstash.io',
    token:'AaC-ASQgMTg0MzdjYjAtMjc2MS00ODY0LWFkZmUtZTExYzkwNzFlYzRkY2Q5NzRkODgzODc1NDgyNmJlMTU2ZGQ4OWM3YjJmZGM=',
  });

  