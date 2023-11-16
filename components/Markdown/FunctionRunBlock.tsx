import { IconPlayerPlay } from '@tabler/icons-react';
import { FC, memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { FunctionCall } from '@/types/chat';

import useFakeTranslation from '@/hooks/useFakeTranslation';

interface Props {
  value: FunctionCall,
  onRun: () => void;
}

const language = 'javascript';

export const FunctionRunBlock: FC<Props> = memo(({value, onRun}: Props) => {
  const { t } = useFakeTranslation('markdown');

  function runFunction() {
    console.log('function ran!!!');
    onRun();
  }

  return (
    <div className="codeblock relative font-sans text-[16px]">
        <div className="flex items-center absolute right-0">
          <button
            className="flex gap-1.5 items-center rounded bg-none p-1 text-xs text-white"
            onClick={runFunction}
          >
            <IconPlayerPlay size={18} /> 
          </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0 }}
      >
        {`${value.name}(${value.arguments})`}
      </SyntaxHighlighter>
    </div>
  );
});
FunctionRunBlock.displayName = 'FunctionRunBlock';
