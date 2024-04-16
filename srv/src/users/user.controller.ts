import { UserService } from './users.service';
import {Controller, Get, Logger, Query} from '@nestjs/common';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  // @Get()
  // async getAllUsers(query) {
  //   this.logger.log('Get all users');
  //   const users = await this.userService.findAll();
  //   return users.map((user) => UsersResponseDto.fromUsersEntity(user));
  // }

  @Get()
  async getPaginatedUsers(@Query() query) {
    this.logger.log('Get paginated users');

    const take = Number(query?.take || 20)
    const page = Number(query?.page || 1)

    const [result, total] = await this.userService.findAndCount(
      {
        order: { id: "ASC" },
        take: take,
        skip: (page - 1) * take
      }
    );

    return {
      data: result,
      pageSize: take,
      count: total
    }
  }
}
