import type { ParsedMessage } from '../lib/hl7/types'
import { SegmentCard } from './SegmentCard'

interface Props {
  message: ParsedMessage
}

export function MessageView({ message }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 pb-2">
        <span className="text-gray-400 text-sm">
          {message.segments.length} segment{message.segments.length !== 1 ? 's' : ''}
        </span>
        <span className="text-gray-600 text-xs font-mono">
          delimiters: {message.delimiters.field} {message.delimiters.component} {message.delimiters.repetition} {message.delimiters.subcomponent}
        </span>
      </div>
      {message.segments.map((seg, i) => (
        <SegmentCard key={`${seg.id}-${i}`} segment={seg} index={i} />
      ))}
    </div>
  )
}
