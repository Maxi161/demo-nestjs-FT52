import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/users.controller';
import { User } from 'src/entities/user.entity';
import { LoggerMiddleware } from 'src/middlewares/logger';
import { UserRepository } from 'src/repositories/users.repository';
import { UserDbService } from 'src/services/user-db.service';
import { UserService } from 'src/services/users.service';

// const userMockService = {
//   getUsers: () => 'Este es el proveedor de servicios mock',
// };

const ACCESS = 'EstaEsMiSuperClaveSecreta';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  // providers: [UserService, UserRepository],
  // providers: [
  //   {
  //     provide: UserService,
  //     useValue: userMockService,
  //   },
  //   UserRepository,
  // ],
  providers: [
    {
      provide: 'ACCESS_TOKEN',
      useValue: ACCESS,
    },
    UserService,
    UserRepository,
    UserDbService,
    {
      provide: 'API_USERS',
      useFactory: async () => {
        const apiUsers = await fetch(
          'https://jsonplaceholder.typicode.com/users',
        ).then((response) => response.json());

        const cleanUsers = apiUsers.map((user: any) => {
          return {
            id: user.id + 3,
            name: user.name,
            email: user.email,
          };
        });

        return cleanUsers;
      },
    },
  ],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users');
  }
}
