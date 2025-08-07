export interface Team {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
}

export interface CreateTeamData {
  name: string;
  code: string;
}

export interface UpdateTeamData {
  name?: string;
  code?: string;
}
