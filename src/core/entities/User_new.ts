export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  teamId?: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  teamId?: string;
}

export interface RegisterWithTeamDTO {
  name: string;
  email: string;
  password: string;
  teamName: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}
