export interface Admin {
  _id: string;
  username: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Test {
  _id: string;
  testType: 'MALE_CHECKUP' | 'FEMALE_CHECKUP';
  userName: string;
  createdAt: string;
}
