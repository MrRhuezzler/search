import { Reflector } from '@nestjs/core';
import { UserRole } from '../dto/user.dto';

const AllowedRoles = Reflector.createDecorator<UserRole[]>();

export const AllowAllRoles = AllowedRoles([UserRole.ADMIN, UserRole.USER]);

export default AllowedRoles;
