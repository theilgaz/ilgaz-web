import { format as sqlFormat } from 'sql-formatter'
import { Formatter, FormatStats } from './types'

function highlightSql(sql: string): JSX.Element[] {
  const elements: JSX.Element[] = []
  let key = 0

  const keywords = new Set([
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL',
    'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
    'ALTER', 'DROP', 'INDEX', 'VIEW', 'JOIN', 'INNER', 'LEFT', 'RIGHT',
    'OUTER', 'FULL', 'CROSS', 'ON', 'AS', 'ORDER', 'BY', 'GROUP', 'HAVING',
    'LIMIT', 'OFFSET', 'UNION', 'ALL', 'DISTINCT', 'CASE', 'WHEN', 'THEN',
    'ELSE', 'END', 'EXISTS', 'BETWEEN', 'LIKE', 'ASC', 'DESC', 'WITH',
    'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CONSTRAINT', 'DEFAULT',
    'CHECK', 'UNIQUE', 'CASCADE', 'TRIGGER', 'PROCEDURE', 'FUNCTION',
    'RETURN', 'BEGIN', 'COMMIT', 'ROLLBACK', 'GRANT', 'REVOKE',
    'INT', 'INTEGER', 'VARCHAR', 'TEXT', 'BOOLEAN', 'DATE', 'TIMESTAMP',
    'FLOAT', 'DOUBLE', 'DECIMAL', 'CHAR', 'BLOB', 'BIGINT', 'SMALLINT',
    'IF', 'REPLACE', 'TRUNCATE', 'EXPLAIN', 'ANALYZE',
  ])

  const functions = new Set([
    'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'COALESCE', 'NULLIF',
    'CONCAT', 'SUBSTRING', 'TRIM', 'UPPER', 'LOWER', 'LENGTH',
    'CAST', 'CONVERT', 'NOW', 'CURRENT_TIMESTAMP', 'CURRENT_DATE',
    'EXTRACT', 'ROUND', 'ABS', 'CEIL', 'FLOOR', 'MOD',
    'ROW_NUMBER', 'RANK', 'DENSE_RANK', 'OVER', 'PARTITION',
    'IFNULL', 'IIF', 'STRING_AGG', 'GROUP_CONCAT',
  ])

  // Tokenize SQL
  const regex = /(--[^\n]*)|('(?:[^'\\]|\\.)*')|("(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|([\w]+)|([(),;*=<>!+\-/.])|(\s+)/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(sql)) !== null) {
    const [token] = match

    // Comment
    if (match[1]) {
      elements.push(<span key={key++} className="hl-comment">{token}</span>)
    }
    // String
    else if (match[2] || match[3]) {
      elements.push(<span key={key++} className="hl-string">{token}</span>)
    }
    // Number
    else if (match[4]) {
      elements.push(<span key={key++} className="hl-number">{token}</span>)
    }
    // Word (keyword, function, or identifier)
    else if (match[5]) {
      const upper = token.toUpperCase()
      if (keywords.has(upper)) {
        elements.push(<span key={key++} className="hl-keyword">{token}</span>)
      } else if (functions.has(upper)) {
        elements.push(<span key={key++} className="hl-function">{token}</span>)
      } else {
        elements.push(<span key={key++} className="hl-identifier">{token}</span>)
      }
    }
    // Operator / punctuation
    else if (match[6]) {
      elements.push(<span key={key++} className="hl-punctuation">{token}</span>)
    }
    // Whitespace
    else if (match[7]) {
      elements.push(<span key={key++}>{token}</span>)
    }
  }

  return elements
}

export const sqlFormatter: Formatter = {
  label: 'SQL',
  placeholder: 'SQL yapıştır veya yaz...',
  supportsMinify: true,
  supportsIndent: false,

  validate(input: string): string | null {
    const trimmed = input.trim()
    if (!trimmed) return 'Boş SQL'
    // Basic validation: check if it starts with a known SQL keyword
    const firstWord = trimmed.split(/\s+/)[0].toUpperCase()
    const validStarts = [
      'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP',
      'WITH', 'EXPLAIN', 'SHOW', 'DESCRIBE', 'USE', 'SET', 'BEGIN',
      'COMMIT', 'ROLLBACK', 'GRANT', 'REVOKE', 'TRUNCATE', 'MERGE',
      'REPLACE', 'CALL', 'EXEC', 'EXECUTE', 'IF', '--', '/*',
    ]
    if (!validStarts.some(s => firstWord.startsWith(s))) {
      return `Geçersiz SQL: Beklenmeyen başlangıç "${firstWord}"`
    }
    return null
  },

  format(input: string): string {
    return sqlFormat(input, { tabWidth: 2, keywordCase: 'upper' })
  },

  minify(input: string): string {
    // Collapse whitespace, keep single spaces
    return input
      .replace(/--[^\n]*/g, '')  // Remove line comments
      .replace(/\/\*[\s\S]*?\*\//g, '')  // Remove block comments
      .replace(/\s+/g, ' ')
      .trim()
  },

  highlight(output: string): JSX.Element[] {
    return highlightSql(output)
  },

  getStats(output: string): FormatStats | null {
    const lines = output.split('\n').length
    // Count statements (by semicolons)
    const statements = (output.match(/;/g) || []).length || 1
    return {
      chars: output.length,
      lines,
      detail: `${statements} sorgu`
    }
  }
}
