import { useMemo } from 'react';

import { ErrorMessage } from '@/types/error';
import useFakeTranslation from '@/hooks/useFakeTranslation';

const useErrorService = () => {
  const { t } = useFakeTranslation('chat');

  return {
    getModelsError: useMemo(
      () => (error: any) => {
        return !error
          ? null
          : ({
              title: t('Error fetching models.'),
              code: error.status || 'unknown',
              messageLines: error.statusText
                ? [error.statusText]
                : [
                    t(
                      'Make sure your OpenAI API key is set in the bottom left of the sidebar.',
                    ),
                    t(
                      'If you completed this step, OpenAI may be experiencing issues.',
                    ),
                  ],
            } as ErrorMessage);
      },
      [t],
    ),
  };
};

export default useErrorService;
