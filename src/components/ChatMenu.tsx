import React from 'react';
import { Button } from './ui/button';

interface ChatMenuProps {
  chats: string[];
  activeChat: string | null;
  chatState: ChatState;
  onCreateNewChat: () => void;
  onSelectChat: (chat: string) => void;
}

interface ChatState {
  [chatId: string]: {
    selectedPool: Pool | null;
  };
}

interface Pool {
  name: string;
  address: string;
}

const ChatMenu: React.FC<ChatMenuProps> = ({ chats, activeChat, chatState, onCreateNewChat, onSelectChat }) => {
  return (
    <div className="w-64  h-full p-4 overflow-y-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-2">
        Crypto.com AI Agent
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        AI-powered technical analysis for cryptocurrency trading data. Input pool address and timeframe to start.
      </p>
      <Button
        className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-4 hover:bg-blue-400"
        onClick={onCreateNewChat}
      >
        Create New Chat
      </Button>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat}
            className={`cursor-pointer p-2 rounded ${
              chat === activeChat ? 'bg-blue-200' : 'hover:bg-gray-200'
            }`}
            onClick={() => onSelectChat(chat)}
          >
            {chatState[chat]?.selectedPool?.name || `Chat ${chat}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatMenu;