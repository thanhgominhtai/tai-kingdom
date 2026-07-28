interface Fetcher {
  fetch(input: Request | string, init?: RequestInit): Promise<Response>;
}

type D1Database = unknown;

declare module "cloudflare:workers" {
  export const env: {
    DB?: never;
  };
}
