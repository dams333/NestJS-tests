import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { TodoController } from './todo/todo.controller';
import { TodoService } from './todo/todo.service';

@Module({
    imports: [],
    controllers: [TodoController, AuthController],
    providers: [TodoService, AuthService],
})
export class AppModule {}
