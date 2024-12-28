import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { OhlcvData } from './GeckoTerminalData';
import { Textarea } from './ui/textarea';
import ResponseDisplay from './ResponseDisplay';
import { Checkbox } from './ui/checkbox';

interface AIAnalysisComponentProps {
    id:string;
    data: OhlcvData[] | null | undefined;
}

interface ResponsePair {
    question: string;
    answer: string;
}

interface AIAnalysisRequest {
    query: string;
    options: {
        openAI: {
            apiKey: string;
        };
        chainId: number;
        explorer: {
            apiKey: string;
        };
    };
}

interface AIAnalysisResponse {
    finalResponse: string;
}

const AIAnalysisComponent: React.FC<AIAnalysisComponentProps> = ({ id,data }) => {
    const [question, setQuestion] = useState<string>('');
    const [responses, setResponses] = useState<ResponsePair[]>(() => {
        const savedResponses = localStorage.getItem(`responses_${id}`);
        return savedResponses ? JSON.parse(savedResponses) : [];
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [checkbox, setCheckbox] = useState<boolean>(false);

    useEffect(() => {
        localStorage.setItem(`responses_${id}`, JSON.stringify(responses));
    }, [responses, id]);
    
    const performAnalysis = async () => {
        const message = checkbox
            ? `Act as technical analyst,${question} OHLCV data:`
            : question;
        setLoading(true);
        setError(null);

        const requestBody: AIAnalysisRequest = {
            query:message.includes("OHLCV data:")?`${message} ${JSON.stringify(data)}`: message,
            options: {
                openAI: {
                    apiKey: import.meta.env.VITE_OPENIAI_APIKEY
                },
                chainId: import.meta.env.VITE_CHAIN_ID,
                explorer: {
                    apiKey: import.meta.env.VITE_EXPLORER_APIKEY
                }
            }
        };

        try {
            const result = await fetch(`${import.meta.env.VITE_AGENT_URL}/api/v1/cdc-ai-agent-service/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!result.ok) {
                throw new Error(`HTTP error! status: ${result.status}`);
            }

            const data: AIAnalysisResponse = await result.json();
            console.log(data);
           // setResponse(data.finalResponse);
            // const data: AIAnalysisResponse = await result.json();
            //console.log(requestBody)
            //const dummy = new Date().toDateString();
            const newResponse = { question: question, answer: data.finalResponse };
            setResponses(prevResponses => [...prevResponses, newResponse]);
            setQuestion("");
        } catch (error) {
            setError('An error occurred while fetching the AI analysis');
            console.error('Error fetching AI analysis:', error);
        }

        setLoading(false);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-1xl m-1 font-semibold mb-4 text-foreground">AI Analysis:</h3>
            {responses.length > 0 && (
                <ResponseDisplay responses={responses} />
            )}
            {loading && (
                <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    <p className="ml-2 text-muted-foreground">Loading analysis...</p>
                </div>
            )}
            {error && (
                <p className="text-destructive bg-destructive/10 p-3 rounded-md">
                    Error: {error}
                </p>
            )}
            <div className="items-top flex space-x-2 m-2">
                <Checkbox
                    id={`passOhlcvData_${id}`}
                    checked={checkbox}
                    onCheckedChange={(checked) => setCheckbox(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                    <label
                        htmlFor={`passOhlcvData_${id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Pass Ohlcv data to prompt
                    </label>
                </div>
            </div>
            <Textarea
                className="m-2 w-full"
                placeholder="Enter your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <Button className="m-2" onClick={performAnalysis} disabled={!question.trim()}>
                Perform AI Analysis
            </Button>
        </div>
    );
};

export default AIAnalysisComponent;