import { useCallback } from 'react';

import { useFetch } from '@/hooks/useFetch';

import { OPENAI_API_HOST, OPENAI_API_TYPE, OPENAI_API_VERSION, OPENAI_ORGANIZATION } from '@/utils/app/const';

import { OpenAIModel, OpenAIModelID, OpenAIModels } from '@/types/openai';

import OpenAI from 'openai';

export interface GetModelsRequestProps {
  key: string;
}

function createOpenAiClient(key: string) {
  return new OpenAI({apiKey: key, dangerouslyAllowBrowser: true})
}

const getModelsHandler = async (keyProp: GetModelsRequestProps): Promise<OpenAIModel[]> => {
  const { key } = keyProp;
  const openAI = new OpenAI({apiKey: key, dangerouslyAllowBrowser: true});
  const openAiModels = await openAI.models.list();
  
  const models: OpenAIModel[] =  openAiModels.data
    .map((model: OpenAI.Models.Model): OpenAIModel | undefined => {
      const model_name = model.id;
      for (const [key, value] of Object.entries(OpenAIModelID)) {
        if (value === model_name) {
          return {
            id: model_name,
            name: OpenAIModels[value].name,
          };
        }
      }
    })
    .filter(Boolean) as OpenAIModel[];
  return models;
};



import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/utils/app/const';
import { OpenAIError, OpenAIStream } from '@/utils/server';

import { ChatBody, Message } from '@/types/chat';

// // @ts-expect-error
// import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';

// import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
// import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';

// export const config = {
//   runtime: 'edge',
// };

// const sendChatMessage = async ({ model, messages, key, prompt, temperature }: ChatBody): Promise<ReadableStream> => {
//     await init((imports) => WebAssembly.instantiate(wasm, imports));
//     const encoding = new Tiktoken(
//       tiktokenModel.bpe_ranks,
//       tiktokenModel.special_tokens,
//       tiktokenModel.pat_str,
//     );

//     let promptToSend = prompt;
//     if (!promptToSend) {
//       promptToSend = DEFAULT_SYSTEM_PROMPT;
//     }

//     let temperatureToUse = temperature;
//     if (temperatureToUse == null) {
//       temperatureToUse = DEFAULT_TEMPERATURE;
//     }

//     const prompt_tokens = encoding.encode(promptToSend);

//     let tokenCount = prompt_tokens.length;
//     let messagesToSend: Message[] = [];

//     for (let i = messages.length - 1; i >= 0; i--) {
//       const message = messages[i];
//       const tokens = encoding.encode(message.content);

//       if (tokenCount + tokens.length + 1000 > model.tokenLimit) {
//         break;
//       }
//       tokenCount += tokens.length;
//       messagesToSend = [message, ...messagesToSend];
//     }

//     encoding.free();

//     const stream = await OpenAIStream(model, promptToSend, temperatureToUse, key, messagesToSend);
//     return stream;
// };



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
    getModelsHandler,
  };
};

export default useApiService;
