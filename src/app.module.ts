import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { TodoController } from './todo/todo.controller';
import { TodoService } from './todo/todo.service';

@Module({
    imports: [
        JwtModule.register({
            secret: `${process.env.JWT_SECRET}`,
            signOptions: { expiresIn: '180s' },
        }),
    ],
    controllers: [TodoController, AuthController],
    providers: [TodoService, AuthService],
})
export class AppModule {}
