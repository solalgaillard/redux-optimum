import { eventChannel } from 'redux-saga';
import {
  put,
  take,
} from 'redux-saga/effects';

const getNetworkEventChannel = eventChannel(emit => {
  const emitOnline = () => emit({ browserIsOnline: true });
  const emitOffline = () => emit({ browserIsOnline: false });

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('online', emitOnline);
    window.addEventListener('offline', emitOffline);
  }

  return () => {
    window.removeEventListener('online', emitOnline);
    window.removeEventListener('offline', emitOffline);
  };
});

const watcherOfflineOnlineEvent = function* () {
  try {
    while (true) {
      const { browserIsOnline } = yield take(getNetworkEventChannel);
      if (browserIsOnline) {
        yield put({ type: 'Event/ONLINE' });
      }
      else {
        yield put({ type: 'Event/OFFLINE' });
      }
    }
  }
  catch {
    // Empty
  }
};

export default watcherOfflineOnlineEvent;
