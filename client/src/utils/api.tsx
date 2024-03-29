import ky, { Options as KYOptions } from "ky";
import { ReactNode, createContext, useContext, useState } from "react";
import io, { Socket } from "socket.io-client";
import { getAccessToken } from "./hass";
import useMountEffect from "./useMountEffect";

export default function api<T = any>(
  path: string,
  method: string,
  body?: any,
  options?: KYOptions
): Promise<T> {
  return ky(`/api${path}`, {
    ...options,
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
    json: body,
  }).json();
}

const SocketIOContext = createContext<Socket | undefined>(undefined);

export function SocketIOProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket>();

  useMountEffect(() => {
    const socket = io({
      path: "/socket",
      auth: { token: `Bearer ${getAccessToken()}` },
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  });

  if (!socket) {
    return null;
  }

  return (
    <SocketIOContext.Provider value={socket}>
      {children}
    </SocketIOContext.Provider>
  );
}

export function useSocketIO() {
  const socket = useContext(SocketIOContext);

  if (!socket) {
    throw new Error("socket not connected");
  }

  return socket;
}
