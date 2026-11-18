declare module 'sec-api' {
  export function setApiKey(apiKey: string): void;
  export const mappingApi: {
    resolve(parameter: string, value: string): Promise<unknown>;
  };
  export const queryApi: {
    getFilings(query: object): Promise<unknown>;
  };
}
