import { ArgumentMetadata, NotFoundException } from '@nestjs/common';
import { Injectable, PipeTransform } from '@nestjs/common';
import { TodoService } from './todo.service';

@Injectable()
export class TodoExist implements PipeTransform {
  constructor(private readonly todoService: TodoService) {}

  transform(id: number, metadata: ArgumentMetadata) {
    const todo = this.todoService.getTodo(id);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found.`);
    }
    return id;
  }
}
