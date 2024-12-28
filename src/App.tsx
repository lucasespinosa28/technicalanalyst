import { useEffect, useState } from "react";
import ChatArea from "./components/ChatArea";
import ChatMenu from "./components/ChatMenu";

interface Pool {
  name: string;
  address: string;
}

interface ChatState {
  [chatId: string]: {
    selectedPool: Pool | null;
  };
}

function App() {
  const [chats, setChats] = useState<string[]>(() => {
    const savedChats = localStorage.getItem("chats");
    return savedChats ? JSON.parse(savedChats) : [];
  });

  const [activeChat, setActiveChat] = useState<string | null>(() => {
    return localStorage.getItem("activeChat");
  });

  const [chatState, setChatState] = useState<ChatState>(() => {
    const savedChatState = localStorage.getItem("chatState");
    return savedChatState ? JSON.parse(savedChatState) : {};
  });

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (activeChat) {
      localStorage.setItem("activeChat", activeChat);
    } else {
      localStorage.removeItem("activeChat");
    }
  }, [activeChat]);

  useEffect(() => {
    localStorage.setItem("chatState", JSON.stringify(chatState));
  }, [chatState]);
  const createNewChat = () => {
    const newChat = `Chat ${chats.length + 1}`;
    setChats([...chats, newChat]);
    setActiveChat(newChat);
    setChatState((prevState) => ({
      ...prevState,
      [newChat]: { selectedPool: null },
    }));
  };

  const updateChatState = (chatId: string, pool: Pool | null) => {
    setChatState((prevState) => ({
      ...prevState,
      [chatId]: { ...prevState[chatId], selectedPool: pool },
    }));
  };

  return (
    <div className="flex  bg-gray-100  h-screen">
      <ChatMenu
        chats={chats}
        activeChat={activeChat}
        chatState={chatState}
        onCreateNewChat={createNewChat}
        onSelectChat={setActiveChat}
      />
      <main className="flex-1 p-4">
        <ChatArea
          id={activeChat || ""}
          activeChat={activeChat}
          chatState={chatState}
          updateChatState={updateChatState}
        />
      </main>
    </div>
  );
}

export default App;
