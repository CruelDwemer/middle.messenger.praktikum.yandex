import { expect } from 'chai';
import Sinon, {
  SinonFakeXMLHttpRequest,
  SinonFakeXMLHttpRequestStatic,
} from 'sinon';
import HTTPTransport, { KeyValueData, TOptions } from './HTTP';
import handleError from '../utils/handleError';

describe('HTTPTransport', () => {
  let xhr: SinonFakeXMLHttpRequestStatic;
  let instance: HTTPTransport;
  let requests: SinonFakeXMLHttpRequest[] = [];

  beforeEach(() => {
    xhr = Sinon.useFakeXMLHttpRequest();
    xhr.onCreate = (request: SinonFakeXMLHttpRequest) => {
      requests.push(request);
    };
    instance = new HTTPTransport('');
  });

  afterEach(() => {
    requests = [];
  });

  it('Should send GET request', () => {
    instance.get('/auth/user', {}).catch(handleError);
    const [request] = requests;
    expect(request.method).to.eq('GET');
  });

  it('Should send POST request', () => {
    instance.post('/auth/signin', {}).catch(handleError);
    const [request] = requests;
    expect(request.method).to.eq('POST');
  });

  it('Should send POST with JSON data', () => {
    const options = { body: { user: 'test' } } as TOptions<KeyValueData>;
    instance.post('/auth/signin', options).catch(handleError);
    const [request] = requests;
    expect(request.requestBody).to.eq(JSON.stringify(options.data));
  });

  it('Should send POST with FormData', () => {
    const formData = new FormData();
    const options = { data: formData };
    instance.post('/auth/signin', options).catch(handleError);
    const [request] = requests;
    expect(request.requestBody).to.eq(options.data);
  });
});
