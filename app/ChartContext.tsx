"use client";
import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FC,
  useContext,
} from "react";
import { Socket, io } from "socket.io-client";
type UserInfoTypes = {
  roomId: string;
  username: string;
};
interface chartInterface {
  socket: Socket | null;
  userInfo: UserInfoTypes;
}
export const ChartContext = createContext<chartInterface>({
  socket: null,
  userInfo: { roomId: "", username: "" },
});
interface ChartProviderProps {
  children: ReactNode;
}
export const ChartContextProvider: FC<ChartProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [user, setUser] = useState<UserInfoTypes>({
    roomId: "",
    username: "",
  });
  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);
  socket?.on("user-info", (roomId, username) => {
    setUser({ roomId, username });
  });
  return (
    <ChartContext.Provider value={{ socket: socket, userInfo: user }}>
      {children}
    </ChartContext.Provider>
  );
};
export const useChartContext = () => useContext(ChartContext);
