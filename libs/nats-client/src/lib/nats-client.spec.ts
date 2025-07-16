import { natsClient } from './nats-client';

describe('natsClient', () => {
  it('should work', () => {
    expect(natsClient()).toEqual('nats-client');
  });
});
