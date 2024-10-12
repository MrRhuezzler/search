import { UserResponseDto } from 'src/user/dto/user.dto';

declare global {
  namespace Express {
    export interface Request {
      user?: UserResponseDto;
    }
  }
}
