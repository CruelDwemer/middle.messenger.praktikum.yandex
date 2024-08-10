const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export type KeyValueData = Record<string, string | number | number[]>;
export type TOptionsData<T = KeyValueData> = T | KeyValueData | FormData;
interface TOptions <T = TOptionsData> {
  headers?: Record<string, string>,
  data?: T,
  method?: string,
  timeout?: number
}

export type HTTPResponse = Promise<{ status: number, response: string } | void>;
export type HTTPRequest = (url: string, options?: TOptions, timeout?: number) => HTTPResponse;

function queryStringify(data: TOptionsData): string {
  if (typeof data !== 'object') {
    throw new Error('Data must be object');
  }

  if (data instanceof FormData) {
    throw new Error('Data must not be FormData');
  }

  const keys = Object.keys(data);
  return keys
    .reduce((result, key, index) => `${result}${key}=${data[key].toString()}${index < keys.length - 1 ? '&' : ''}`, '?');
}

export default class HTTPTransport {
  baseUrl: string = '';

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  get: HTTPRequest = (url: string = '', options: TOptions = {}) => (
    this.request(url, { ...options, method: METHODS.GET }, options.timeout)
  );

  post: HTTPRequest = (url: string = '', options: TOptions = {}) => (
    this.request(url, { ...options, method: METHODS.POST }, options.timeout)
  );

  put: HTTPRequest = (url: string = '', options: TOptions = {}) => (
    this.request(url, { ...options, method: METHODS.PUT }, options.timeout)
  );

  delete: HTTPRequest = (url: string = '', options: TOptions = {}) => (
    this.request(url, { ...options, method: METHODS.DELETE }, options.timeout)
  );

  request: HTTPRequest = (url: string = '', options: TOptions = {}, timeout: number = 5000) => {
    const { headers = {}, method, data } = options;
    const { baseUrl } = this;

    return new Promise((resolve, reject) => {
      if (!method) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('No method');
        return;
      }

      // eslint-disable-next-line no-undef
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      const isGet = method === METHODS.GET;

      xhr.open(
        method,
        isGet && !!data
          ? `${baseUrl}${url}${queryStringify(data)}`
          : baseUrl + url,
      );
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      // eslint-disable-next-line func-names
      xhr.onload = function () {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;

      xhr.timeout = timeout;
      xhr.ontimeout = reject;

      if (isGet || !data) {
        xhr.send();
      } else {
        const sendData = data instanceof FormData ? data : JSON.stringify(data);
        xhr.send(sendData);
      }
    });
  };
}
