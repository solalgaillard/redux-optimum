import { expectSaga } from 'redux-saga-test-plan';
/* eslint-disable import/named */
import watcherOfflineOnlineEvent, {
  __RewireAPI__ as networkDetection,
} from './network-detection';
/* eslint-enable import/named */

describe('network Detection Integration Testing', () => {
  function provideEvent(event) {
    let consumed = false;

    return {
      take({ channel }, next) {
        if (channel === networkDetection.__get__('getNetworkEventChannel')
          && !consumed) {
          consumed = true;
          return event;
        }
        return next();
      },
    };
  }

  it('browser Turns Online', async () => {
    const fakeEvent = { browserIsOnline: true };

    await expectSaga(watcherOfflineOnlineEvent)
      .provide([
        provideEvent(fakeEvent),
      ])
      .put({ type: 'Event/ONLINE' })

      .silentRun();
  });

  it('browser Turns Offline', async () => {
    const fakeEvent = { browserIsOnline: false };

    await expectSaga(watcherOfflineOnlineEvent)
      .provide([
        provideEvent(fakeEvent),
      ])
      .put({ type: 'Event/OFFLINE' })
      .silentRun();
  });
});
