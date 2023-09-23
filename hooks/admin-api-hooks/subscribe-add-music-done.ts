import { useAuth } from '@/contexts/AuthContext';
import { useStomp } from '@/contexts/StompContext';
import {
  IMessage,
  StompSubscription,
  messageCallbackType,
} from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';

function useSubscribeAddMusicDone() {
  const { userData } = useAuth();
  const { subscribe, unsubscribe, isConnected } = useStomp();
  const subscriptions = useRef<Array<StompSubscription>>([]);
  const [isDone, setIsDone] = useState(false);
  useEffect(() => {
    if (
      isConnected &&
      typeof subscribe === 'function' &&
      !!subscribe &&
      typeof unsubscribe === 'function' &&
      userData?.id
    ) {
      const subscription = subscribe(
        `/topic/post/admin/music/${userData?.id}`,
        (message: IMessage) => {
          try {
            const response = message?.body;
            const isSuccess: boolean = JSON.parse(response).success;
            setIsDone(isSuccess);
          } catch (error) {
            console.error(error);
            setIsDone(false);
          }
        }
      );
      if (subscription) {
        subscriptions.current?.push(subscription);
      }
    }

    return () => {
      subscriptions.current.forEach((subscription) =>
        unsubscribe?.(subscription)
      );
    };
  }, [isConnected, subscribe, unsubscribe, userData]);

  return {
    isDone,
  };
}

export default useSubscribeAddMusicDone;
