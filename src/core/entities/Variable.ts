export interface Variable {
  id: number;
  key: string;
  value: string;
  applicationId: string;
}

export interface CreateVariableDTO {
  key: string;
  value: string;
  applicationId: string;
}

export interface UpdateVariableDTO {
  key?: string;
  value?: string;
}
