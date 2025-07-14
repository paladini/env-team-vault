export interface Application {
  id: string;
  name: string;
  createdAt: Date;
  userId: string;
}

export interface CreateApplicationDTO {
  name: string;
  userId: string;
}

export interface UpdateApplicationDTO {
  name?: string;
}
