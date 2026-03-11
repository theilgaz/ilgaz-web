export type FormatType = 'json' | 'xml' | 'yaml' | 'sql'

export interface FormatStats {
  chars: number
  lines: number
  detail: string
}

export interface Formatter {
  format(input: string, indentSize: number): string
  minify(input: string): string
  highlight(output: string): JSX.Element[]
  getStats(output: string): FormatStats | null
  validate(input: string): string | null
  placeholder: string
  supportsMinify: boolean
  supportsIndent: boolean
  label: string
}
