import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import './CodeEditor.css'

type Props = {
  value: string
  onChange: (value: string) => void
  ariaLabel: string
}

export function CodeEditor({ value, onChange, ariaLabel }: Props) {
  return (
    <div className="code-editor" aria-label={ariaLabel}>
      <CodeMirror
        value={value}
        height="250px"
        minHeight="250px"
        theme={oneDark}
        extensions={[javascript({ typescript: true })]}
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
