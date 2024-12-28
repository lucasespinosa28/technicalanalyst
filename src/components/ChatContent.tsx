import React from 'react';
import GeckoTerminalForm from "./GeckoTerminalForm";
import PoolSearch from "./PoolSearch";
import { FormData } from './FormData';
import { OhlcvData } from "./GeckoTerminalData";
import { useEffect, useState } from "react";
import AIAnalysisComponent from "./AIAnalysisComponent";
import OHLCVData from "./OHLCVData";
import OHLCVDisplay from "./OHLCVDisplay";

interface Pool {
    name: string;
    address: string;
}

interface ChatState {
    [chatId: string]: {
        selectedPool: Pool | null;
    };
}


interface ChatContentProps {
    id: string;
    activeChat: string;
    chatState: ChatState;
    updateChatState: (chatId: string, pool: Pool | null) => void;
}

const ChatContent: React.FC<ChatContentProps> = ({ id, activeChat, chatState, updateChatState }) => {
    const selectedPool = chatState[activeChat]?.selectedPool || null;
    const [formData, setFormData] = useState<FormData | null>(() => {
        const savedFormData = localStorage.getItem(`formData_${id}`);
        return savedFormData ? JSON.parse(savedFormData) : null;
    });
    const [geckoTerminalData, setGeckoTerminalData] = useState<OhlcvData[] | null>(() => {
        const savedGeckoTerminalData = localStorage.getItem(`geckoTerminalData_${id}`);
        return savedGeckoTerminalData ? JSON.parse(savedGeckoTerminalData) : null;
    });

    useEffect(() => {
        if (formData) {
            localStorage.setItem(`formData_${id}`, JSON.stringify(formData));
        }
    }, [formData, id]);

    useEffect(() => {
        if (geckoTerminalData) {
            localStorage.setItem(`geckoTerminalData_${id}`, JSON.stringify(geckoTerminalData));
        }
    }, [geckoTerminalData, id]);

    const handleGeckoTerminalSubmit = (formData: FormData) => {
        console.log('GeckoTerminal form submitted:', formData);
        setFormData(formData);
    };

    return (
        <>
            <h2 className="text-2xl mb-4">{selectedPool ? selectedPool.name : 'Select a Pool'}</h2>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Select a Pool</h3>
                <PoolSearch id={`pool-search-${id}`} setSelectedPool={(pool) => updateChatState(activeChat, pool)} />
            </div>
            {selectedPool && (
                <div>
                    <GeckoTerminalForm id={`gecko-form-${id}`} poolAddresses={selectedPool.address} onSubmit={handleGeckoTerminalSubmit} />
                    {formData && <OHLCVData id={`ohlcv-data-${id}`} setGeckoTerminalData={setGeckoTerminalData} pool_address={formData.pool_address} timeframe={formData.timeframe} aggregate={formData.aggregate} limit={formData.limit} />}
                    {geckoTerminalData && <OHLCVDisplay id={`ohlcv-display-${id}`} data={geckoTerminalData} />}
                    <AIAnalysisComponent id={`ai-analysis-${id}`} data={geckoTerminalData} />
                </div>
            )}
        </>
    );
};
export default ChatContent;