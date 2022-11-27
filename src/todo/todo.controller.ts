import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    ValidationPipe,
} from '@nestjs/common';
import { CreateTodoDto } from 'src/types/todo.model';
import { TodoService } from './todo.service';
import { TodoExist } from './todoExist.pipe';

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Get()
    getTodos(): string {
        return this.todoService.getTodos();
    }

    @Get(':id')
    getTodo(
        @Param('id', new ValidationPipe(), TodoExist)
        id: number,
    ): string {
        return this.todoService.getTodo(id);
    }

    @Post('add')
    addTodo(@Body(new ValidationPipe()) body: CreateTodoDto): string {
        return this.todoService.addTodo(body);
    }

    @Post('done/:id')
    doneTodo(@Param('id', new ValidationPipe(), TodoExist) id: number): string {
        return this.todoService.doneTodo(id);
    }

    @Delete(':id')
    deleteTodo(
        @Param('id', new ValidationPipe(), TodoExist) id: number,
    ): string {
        return this.todoService.deleteTodo(id);
    }
}
