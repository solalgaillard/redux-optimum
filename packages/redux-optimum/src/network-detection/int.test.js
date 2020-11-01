import {
  __RewireAPI__ as networkDetection,
  default as watcherOfflineOnlineEvent
} from "./network-detection";
import {expectSaga} from "redux-saga-test-plan";


describe('Network Detection Integration Testing', () => {


  function provideEvent(event) {
    let consumed = false;

    return {
      take({ channel }, next) {
        if (channel === networkDetection.__get__("getNetworkEventChannel") && !consumed) {
          consumed = true;
          return event;
        }

        return next();
      },
    };
  }

  it('Browser Turns Online', () => {
    const fakeEvent = {browserIsOnline: true};

    return expectSaga(watcherOfflineOnlineEvent)

      .provide([
        provideEvent(fakeEvent),
      ])
      .put({type: 'Event/ONLINE'})

      .silentRun();
  });


  it('Browser Turns Offline', () => {
    const fakeEvent = {browserIsOnline: false};


    return expectSaga(watcherOfflineOnlineEvent)
      .provide([
        provideEvent(fakeEvent),
      ])
      .put({type: 'Event/OFFLINE'})

      .silentRun();
  });

});
