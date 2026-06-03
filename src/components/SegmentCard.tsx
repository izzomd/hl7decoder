import { useState } from 'react'
import type { ParsedSegment } from '../lib/hl7/types'
import { getFieldName, getSegmentName } from '../lib/hl7/definitions'

interface Props {
  segment: ParsedSegment
  index: number
}

const SEGMENT_COLORS: Record<string, string> = {
  MSH: 'bg-violet-700',
  PID: 'bg-blue-700',
  PV1: 'bg-sky-700',
  PV2: 'bg-sky-800',
  EVN: 'bg-teal-700',
  NK1: 'bg-cyan-700',
  ORC: 'bg-amber-700',
  OBR: 'bg-orange-700',
  OBX: 'bg-rose-700',
  NTE: 'bg-slate-600',
  AL1: 'bg-red-700',
  DG1: 'bg-pink-700',
  PR1: 'bg-fuchsia-700',
  GT1: 'bg-indigo-700',
  IN1: 'bg-emerald-700',
  IN2: 'bg-emerald-800',
  MSA: 'bg-green-700',
  ERR: 'bg-red-800',
  RXO: 'bg-lime-700',
  RXE: 'bg-lime-800',
  RXA: 'bg-yellow-700',
  RXR: 'bg-yellow-800',
  SPM: 'bg-stone-600',
  ROL: 'bg-slate-700',
}

function getColor(id: string): string {
  return SEGMENT_COLORS[id] ?? (id.startsWith('Z') ? 'bg-zinc-700' : 'bg-gray-600')
}

function FieldValue({ raw, repSep = '~', compSep = '^' }: { raw: string; repSep?: string; compSep?: string }) {
  if (!raw) return <span className="text-gray-400 italic text-xs">empty</span>

  const hasReps = raw.includes(repSep)
  const hasComps = raw.includes(compSep)

  if (!hasReps && !hasComps) {
    return <span className="font-mono text-sm text-gray-100">{raw}</span>
  }

  const reps = raw.split(repSep)
  return (
    <div className="space-y-1">
      {reps.map((rep, ri) => {
        const comps = rep.split(compSep)
        if (comps.length === 1) {
          return (
            <div key={ri} className="font-mono text-sm text-gray-100">
              {reps.length > 1 && <span className="text-gray-400 text-xs mr-1">[{ri + 1}]</span>}
              {rep}
            </div>
          )
        }
        return (
          <div key={ri} className="pl-2 border-l border-gray-600 space-y-0.5">
            {reps.length > 1 && <div className="text-gray-400 text-xs mb-1">Repetition {ri + 1}</div>}
            {comps.map((c, ci) => (
              <div key={ci} className="flex gap-2 items-baseline">
                <span className="text-gray-500 text-xs w-5 shrink-0">.{ci + 1}</span>
                <span className="font-mono text-sm text-gray-200">{c || <span className="text-gray-500 italic">—</span>}</span>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export function SegmentCard({ segment, index }: Props) {
  const [open, setOpen] = useState(index < 3)
  const colorClass = getColor(segment.id)
  const segmentName = getSegmentName(segment.id)

  const nonEmptyFields = segment.fields.filter(f => f.raw)

  return (
    <div className="rounded-lg overflow-hidden border border-gray-700 shadow-sm">
      <button
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left ${colorClass} hover:brightness-110 transition-all`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="font-mono font-bold text-white text-sm tracking-wider">{segment.id}</span>
        <span className="text-white/80 text-sm">{segmentName}</span>
        <span className="ml-auto text-white/50 text-xs">
          {nonEmptyFields.length} field{nonEmptyFields.length !== 1 ? 's' : ''}
        </span>
        <svg
          className={`w-4 h-4 text-white/70 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="bg-gray-800">
          {segment.fields.length === 0 && (
            <p className="text-gray-500 text-sm px-4 py-3 italic">No fields</p>
          )}
          <table className="w-full text-sm">
            <tbody>
              {segment.fields.map((field) => {
                if (!field.raw && field.index > segment.fields.filter(f => f.raw).reduce((max, f) => Math.max(max, f.index), 0)) return null
                const name = getFieldName(segment.id, field.index)
                return (
                  <tr key={field.index} className="border-b border-gray-700/50 last:border-0 hover:bg-gray-700/30">
                    <td className="px-3 py-2 text-gray-500 font-mono text-xs align-top w-12 shrink-0">
                      {segment.id}.{field.index}
                    </td>
                    <td className="px-3 py-2 text-gray-400 align-top w-56 shrink-0 text-xs leading-5">
                      {name}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <FieldValue raw={field.raw} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
