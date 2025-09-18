export interface Application {
  id: string;
  name: string;
  createdAt: Date;
  teamId: string;
}

export interface CreateApplicationDTO {
  name: string;
  teamId: string;
}

export interface UpdateApplicationDTO {
  name?: string;
}
