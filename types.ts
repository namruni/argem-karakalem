export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: number;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  VALIDATING = 'VALIDATING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
  sanitizedQuery?: string;
}
