export interface ParsedComponent {
  index: number
  raw: string
  subcomponents: string[]
}

export interface ParsedRepetition {
  raw: string
  components: ParsedComponent[]
}

export interface ParsedField {
  index: number
  raw: string
  repetitions: ParsedRepetition[]
}

export interface ParsedSegment {
  position: number
  id: string
  raw: string
  fields: ParsedField[]
}

export interface ParsedMessage {
  segments: ParsedSegment[]
  delimiters: {
    field: string
    component: string
    repetition: string
    escape: string
    subcomponent: string
  }
}

export interface ParseError {
  message: string
}
