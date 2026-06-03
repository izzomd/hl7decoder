import { useState, useCallback } from 'react'
import { parseHL7 } from './lib/hl7/parser'
import type { ParsedMessage } from './lib/hl7/types'
import { MessageView } from './components/MessageView'

const SAMPLE_HL7 = `MSH|^~\\&|EPIC|HOSPITAL|LAB|HOSPITAL|20230615143022||ORU^R01^ORU_R01|MSG0001|P|2.5
PID|1||MR123456^^^HOSPITAL^MR||DOE^JOHN^A||19850315|M||2106-3^White^HL70005|123 MAIN ST^^ANYTOWN^CA^90210^USA||5551234567^PRN^PH|||S||ACC987654
PV1|1|O|CLINIC^101^A^HOSPITAL||||DR001^SMITH^JANE^A^^^MD|DR002^JONES^ROBERT^^^MD||CARD||||1|||DR001^SMITH^JANE^^^MD|O||||||||||||||||||HOSPITAL|||||||20230615140000
ORC|RE|ORD20230001|FILL20230001||CM||||20230615143022|||DR001^SMITH^JANE^A^^^MD
OBR|1|ORD20230001|FILL20230001|2160-0^Creatinine^LN|||20230615143022|20230615143022||||||||DR001^SMITH^JANE^A^^^MD|5551234567|||||||F
OBX|1|NM|2160-0^Creatinine^LN||1.1|mg/dL^mg/dL^UCUM|0.6-1.2||||F|||20230615143022
OBX|2|NM|33914-3^eGFR^LN||72|mL/min/1.73m2^mL/min/1.73m2^UCUM|>=60||||F|||20230615143022
NTE|1||Patient fasting for 8 hours prior to collection.`

export default function App() {
  const [raw, setRaw] = useState('')
  const [parsed, setParsed] = useState<ParsedMessage | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleParse = useCallback((input: string) => {
    if (!input.trim()) {
      setParsed(null)
      setError(null)
      return
    }
    try {
      const result = parseHL7(input)
      setParsed(result)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse message')
      setParsed(null)
    }
  }, [])

  const handleChange = (value: string) => {
    setRaw(value)
    handleParse(value)
  }

  const loadSample = () => handleChange(SAMPLE_HL7)
  const clear = () => handleChange('')

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="border-b border-gray-700 px-6 py-4 flex items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">HL7 Decode</h1>
          <p className="text-gray-400 text-xs mt-0.5">Paste raw HL7 2.x messages to decode them into human-readable format</p>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-[calc(100vh-65px)]">
        {/* Input Panel */}
        <div className="flex flex-col border-r border-gray-700">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-gray-800/50">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Raw HL7</span>
            <div className="flex gap-2">
              <button
                onClick={loadSample}
                className="text-xs px-2.5 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
              >
                Load sample
              </button>
              <button
                onClick={clear}
                className="text-xs px-2.5 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={raw}
            onChange={e => handleChange(e.target.value)}
            placeholder="MSH|^~\&|..."
            spellCheck={false}
            className="flex-1 w-full bg-gray-950 text-gray-200 font-mono text-sm p-4 resize-none focus:outline-none placeholder-gray-600"
          />
        </div>

        {/* Output Panel */}
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center px-4 py-2 border-b border-gray-700 bg-gray-800/50">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Decoded</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {!raw.trim() && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-gray-600 text-4xl mb-4">⌨</div>
                <p className="text-gray-500 text-sm">Paste an HL7 message on the left to decode it</p>
                <button
                  onClick={loadSample}
                  className="mt-3 text-xs px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                >
                  or load a sample message
                </button>
              </div>
            )}
            {error && (
              <div className="rounded-lg bg-red-900/30 border border-red-800 px-4 py-3 text-red-300 text-sm">
                <span className="font-semibold">Parse error: </span>{error}
              </div>
            )}
            {parsed && <MessageView message={parsed} />}
          </div>
        </div>
      </main>
    </div>
  )
}
