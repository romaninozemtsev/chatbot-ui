import { useCallback } from 'react';

import { useFetch } from '@/hooks/useFetch';

import { OPENAI_API_HOST, OPENAI_API_TYPE, OPENAI_API_VERSION, OPENAI_ORGANIZATION } from '@/utils/app/const';

import { OpenAIModel, OpenAIModelID, OpenAIModels } from '@/types/openai';
import { ChatBody, Message } from '@/types/chat';

import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

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
  const chatStream = await openAI.chat.completions.create({
    messages: messagesWithPrompt,
    stream: true,
    model: model.id,
    temperature
  });

  return chatStream;
};


const useApiService = () => {
  const fetchService = useFetch();

  // const getModels = useCallback(
  // 	(
  // 		params: GetManagementRoutineInstanceDetailedParams,
  // 		signal?: AbortSignal
  // 	) => {
  // 		return fetchService.get<GetManagementRoutineInstanceDetailed>(
  // 			`/v1/ManagementRoutines/${params.managementRoutineId}/instances/${params.instanceId
  // 			}?sensorGroupIds=${params.sensorGroupId ?? ''}`,
  // 			{
  // 				signal,
  // 			}
  // 		);
  // 	},
  // 	[fetchService]
  // );

  return {
    getModels: getModelsHandler,
    sendChatMessage,
  };
};

export default useApiService;
