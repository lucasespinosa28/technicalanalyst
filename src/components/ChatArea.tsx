import React from 'react';
import ChatContent from './ChatContent';

interface ChatAreaProps {
    id: string;
    activeChat: string | null;
    chatState: ChatState;
    updateChatState: (chatId: string, pool: Pool | null) => void;
}

interface Pool {
    name: string;
    address: string;
}

interface ChatState {
    [chatId: string]: {
        selectedPool: Pool | null;
    };
}

const ChatArea: React.FC<ChatAreaProps> = ({ id, activeChat, chatState, updateChatState }) => {
    return (
        <div className="h-full flex-1 flex flex-col" id={`chat-area-${id}`}>
            {activeChat ? (
                <ChatContent
                    key={`chat-content-${id}`}
                    id={`chat-content-${id}`}
                    activeChat={activeChat}
                    chatState={chatState}
                    updateChatState={updateChatState}
                />
            ) : (
                <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">Select a chat or create a new one</p>
                </div>
            )}
        </div>
    );
};

export default ChatArea;