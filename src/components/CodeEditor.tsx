import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import './CodeEditor.css'

export type EditorLanguage = 'typescript' | 'python'

type Props = {
  value: string
  onChange: (value: string) => void
  ariaLabel: string
  language: EditorLanguage
}

export function CodeEditor({ value, onChange, ariaLabel, language }: Props) {
  const languageExtension = language === 'python' ? python() : javascript({ typescript: true })

  return (
    <div className="code-editor" aria-label={ariaLabel}>
      <CodeMirror
        value={value}
        height="250px"
        minHeight="250px"
        theme={oneDark}
        extensions={[languageExtension]}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: false,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
        onChange={onChange}
      />
    </div>
  )
}
