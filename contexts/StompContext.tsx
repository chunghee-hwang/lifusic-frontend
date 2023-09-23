import { StompContextValue } from '@/constants/types/types';
import SockJS from 'sockjs-client';
import Cookies from 'js-cookie';
import {
  CompatClient,
  IMessage,
  Stomp,
  StompHeaders,
  StompSubscription,
  messageCallbackType,
} from '@stomp/stompjs';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AUTH_KEY } from '@/constants/cookie-keys';

const StompContext = createContext<StompContextValue>({
  isConnected: false,
});

StompContext.displayName = 'StompContext';

export const useStomp = () => {
  return useContext(StompContext);
};

export const StompContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const stompClient = useRef<CompatClient>();
  const subscriptions = useRef<Array<StompSubscription>>([]);

  const [isConnected, setIsConnected] = useState(false);

  const subscribe = useCallback(
    (
      destination: string,
      callback: messageCallbackType,
      headers?: StompHeaders
    ) => {
      if (isConnected && stompClient?.current) {
        if (subscriptions.current.find((sub) => sub.id === subscription.id)) {
          return null;
        }
        const subscription = stompClient.current.subscribe(
          destination,
          (message: IMessage) => {
            console.log('message received: ', message);
            callback(message);
          },
          headers
        );
        console.log('subscribed:', subscription);
        subscriptions.current?.push(subscription);
        return subscription;
      }
    },
    [stompClient, isConnected]
  );

  const unsubscribe = useCallback(
    (subscription: StompSubscription) => {
      if (isConnected && stompClient.current) {
        subscriptions.current =
          subscriptions.current?.filter((sub) => sub.id !== subscription.id) ||
          [];
        console.log('unsubscribed:', subscription);
        subscription.unsubscribe();
      }
    },
    [stompClient.current]
  );

  useEffect(() => {
    stompClient.current = Stomp.over(() => {
      return new SockJS(`${process.env.NEXT_PUBLIC_API_HOST}/ws-endpoint`);
    });

    stompClient.current.connect(
      {
        Authorization: `Bearer ${Cookies.get(AUTH_KEY)}`,
      },
      () => {
        console.log('web socket connected!');
        setIsConnected(true);
      }
    );

    return () => {
      subscriptions.current?.forEach((subscription) => {
        console.log('unsubscribed:', subscription);
        subscription.unsubscribe();
      });
      setIsConnected(false);
      stompClient.current?.disconnect();
    };
  }, []);

  return (
    <StompContext.Provider
      value={{
        subscribe,
        unsubscribe,
        isConnected,
      }}
    >
      {children}
    </StompContext.Provider>
  );
};
