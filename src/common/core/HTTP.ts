const METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};

export type TOptionsData = Record<string, string | number | number[]> | FormData
type TOptions = {
    headers?: Record<string, string>,
    data?: TOptionsData,
    method?: string,
    timeout?: number
}
type HTTPMethod = (url: string, options?: TOptions) => Promise<unknown>
type HTTPRequest = (url: string, options?: TOptions, timeout?: number) => Promise<unknown | void>

function queryStringify(data: TOptionsData): string {
    if (typeof data !== 'object') {
        throw new Error('Data must be object');
    }

    const keys = Object.keys(data);
    return keys
        .reduce((result, key, index) => `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`, '?');
}

export default class HTTPTransport {
    baseUrl: string = '';

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    get: HTTPMethod = (url: string = '', options: TOptions = {}) => (
        this.request(url, { ...options, method: METHODS.GET }, options.timeout)
    );

    post: HTTPMethod = (url: string = '', options: TOptions = {}) => (
        this.request(url, { ...options, method: METHODS.POST }, options.timeout)
    );

    put: HTTPMethod = (url: string = '', options: TOptions = {}) => (
        this.request(url, { ...options, method: METHODS.PUT }, options.timeout)
    );

    delete: HTTPMethod = (url: string = '', options: TOptions = {}) => (
        this.request(url, { ...options, method: METHODS.DELETE }, options.timeout)
    );

    request: HTTPRequest = (url: string = '', options: TOptions = {}, timeout: number = 5000): Promise<unknown | void> => {
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
                xhr.send(sendData)
            }
        });
    };
}
