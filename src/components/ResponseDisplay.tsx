import React from 'react';
import Markdown from 'react-markdown'

interface ResponsePair {
    question: string;
    answer: string;
}

interface ResponseDisplayProps {
    responses: ResponsePair[];
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ responses }) => {
    return (
        <div className="bg-accent/10 p-4 rounded-md">
            {responses.map((response, index) => (
                <div key={index} className="mb-4 last:mb-0">
                    <p className="font-semibold text-primary mt-2">Question:</p>
                    <Markdown className="text-accent-foreground whitespace-pre-wrap">{response.question}</Markdown>
                    <p className="font-semibold text-primary mt-2">Answer:</p>
                    <Markdown className="text-accent-foreground whitespace-pre-wrap">{response.answer}</Markdown>
                    {index < responses.length - 1 && <hr className="my-4 border-accent/20" />}
                    <hr />
                </div>
            ))}
        </div>
    );
};

export default ResponseDisplay;