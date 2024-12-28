import { useState, useEffect } from 'react';

interface AIAnalysisOptions {
  openAI: {
    apiKey: string;
  };
  chainId: number;
  explorer: {
    apiKey: string;
  };
}

interface AIAnalysisRequest {
  query: string;
  options: AIAnalysisOptions;
}

interface AIAnalysisResponse {
  finalResponse: string;
}

export const useAIAnalysis = (query: string) => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
// console.log(query)
  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);

      const requestBody: AIAnalysisRequest = {
        query,
        options: {
          openAI: {
            apiKey: "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"
          },
          chainId: 240,
          explorer: {
            apiKey: "XjshPKzuEwHpC5HBG0oj9vC5YQTiPcVf"
          }
        }
      };

      try {
        const result = await fetch('http://localhost:8000/api/v1/cdc-ai-agent-service/query', {
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
        console.log(data.finalResponse);
        setResponse(data.finalResponse);
      } catch (error) {
        setError('An error occurred while fetching the AI analysis');
        console.error('Error fetching AI analysis:', error);
      }

      setLoading(false);
    };

    if (query) {
      fetchAnalysis();
    }
  }, [query]);

  return { response, loading, error };
};