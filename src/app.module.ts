import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TodoController } from './todo/todo.controller';
import { AppService } from './app.service';
import { TodoService } from './todo/todo.service';

@Module({
  imports: [],
  controllers: [AppController, TodoController],
  providers: [AppService, TodoService],
  exports: [TodoService],
})
export class AppModule {}
