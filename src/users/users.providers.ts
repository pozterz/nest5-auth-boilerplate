import { Users } from './model/users.model';
import { userRepo } from '../config/constants'

export const UserProviders = [
  {
    provide: userRepo,
    useValue: Users,
  },
];