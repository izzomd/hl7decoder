import type { ParsedMessage, ParsedSegment, ParsedField, ParsedRepetition, ParsedComponent } from './types'

function parseComponent(raw: string, subSep: string, index: number): ParsedComponent {
  return {
    index,
    raw,
    subcomponents: raw.split(subSep),
  }
}

function parseRepetition(raw: string, compSep: string, subSep: string): ParsedRepetition {
  return {
    raw,
    components: raw.split(compSep).map((c, i) => parseComponent(c, subSep, i + 1)),
  }
}

function parseField(raw: string, repSep: string, compSep: string, subSep: string, index: number): ParsedField {
  return {
    index,
    raw,
    repetitions: raw.split(repSep).map(r => parseRepetition(r, compSep, subSep)),
  }
}

export function parseHL7(input: string): ParsedMessage {
  const normalized = input.trim().replace(/\r\n?/g, '\n')
  const lines = normalized.split('\n').filter(l => l.trim())

  if (!lines.length) throw new Error('Empty input')
  if (!lines[0].startsWith('MSH')) throw new Error('Message must begin with an MSH segment')
  if (lines[0].length < 8) throw new Error('MSH segment is too short to be valid')

  const fieldSep = lines[0][3]
  const encodingChars = lines[0].split(fieldSep)[1] ?? '^~\\&'
  const componentSep = encodingChars[0] ?? '^'
  const repetitionSep = encodingChars[1] ?? '~'
  const escapeSep = encodingChars[2] ?? '\\'
  const subcomponentSep = encodingChars[3] ?? '&'

  const segments: ParsedSegment[] = lines.map((line, pos) => {
    const id = line.substring(0, 3)
    const parts = line.split(fieldSep)

    let rawFields: string[]
    if (id === 'MSH') {
      // MSH-1 is the field separator itself; MSH-2 is encodingChars (parts[1] after split)
      rawFields = [id, fieldSep, ...parts.slice(1)]
    } else {
      rawFields = parts
    }

    // rawFields[0] is segment ID (not a numbered field), rawFields[1..n] are fields 1..n
    const fields: ParsedField[] = rawFields
      .slice(1)
      .map((f, i) => parseField(f, repetitionSep, componentSep, subcomponentSep, i + 1))

    return { position: pos, id, raw: line, fields }
  })

  return {
    segments,
    delimiters: {
      field: fieldSep,
      component: componentSep,
      repetition: repetitionSep,
      escape: escapeSep,
      subcomponent: subcomponentSep,
    },
  }
}
