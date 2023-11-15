import { useFetch } from '@/hooks/useFetch';
import { OpenAIModel, OpenAIModelID, OpenAIModels } from '@/types/openai';
import { ChatBody, Message } from '@/types/chat';

import OpenAI from 'openai';

export interface GetModelsRequestProps {
  key: string;
}

function createOpenAiClient(key: string) {
  return new OpenAI({apiKey: key, dangerouslyAllowBrowser: true})
}

const getModelsHandler = async (keyProp: GetModelsRequestProps): Promise<OpenAIModel[]> => {
  const { key } = keyProp;
  const openAI = createOpenAiClient(key);
  const openAiModels = await openAI.models.list();
  
  const models: OpenAIModel[] =  openAiModels.data
    .map((model: OpenAI.Models.Model): OpenAIModel | undefined => {
      const model_name = model.id;
      for (const [key, value] of Object.entries(OpenAIModelID)) {
        if (value === model_name) {
          return OpenAIModels[value];
        }
      }
    })
    .filter(Boolean) as OpenAIModel[];
  return models;
};


const sendChatMessage = async ({ model, messages, key, prompt, temperature }: ChatBody) => {
  const messagesWithPrompt = [
    {
      role: 'system',
      content: prompt,
    },
    ...messages,
  ] as Message[];

  const openAI = createOpenAiClient(key);
  const chatStream = openAI.beta.chat.completions
  .stream({
    messages: messagesWithPrompt,
    model: model.id,
    //temperature,
    //stream: true,
    functions: [
      {
        name: "getCurrentLocation",
        parameters: { type: 'object', properties: {} },
      },
      {
        name: "getWeather",
        //parse: JSON.parse, // or use a validation library like zod for typesafe parsing.
        parameters: {
          type: 'object',
          properties: {
            location: { type: 'string' },
          },
        },
      }
    ],
  });
  return chatStream;
};

async function getCurrentLocation() {
  console.log('===getCurrentLocation')
  return 'Boston'; // Simulate lookup
}

async function getWeather(args: { location: string }) {
  console.log('===getWeather')
  const { location } = args;
  // … do lookup …
  const temperature = 72;
  const precipitation = 0.2;
  return { temperature, precipitation };
}


const useApiService = () => {
  const fetchService = useFetch();
  return {
    getModels: getModelsHandler,
    sendChatMessage,
  };
};

export default useApiService;
