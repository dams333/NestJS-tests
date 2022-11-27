import { Injectable } from '@nestjs/common';
import { Todo, CreateTodoDto } from '../types/todo.model';

let todos: Todo[] = [];

@Injectable()
export class TodoService {
    getTodos(): string {
        return JSON.stringify(todos);
    }

    getTodo(id: number): string {
        return JSON.stringify(todos.find((todo) => todo.id == id));
    }

    addTodo(todo: CreateTodoDto): string {
        const newTodo = { id: todos.length, ...todo, done: false };
        todos.push(newTodo);
        return JSON.stringify(newTodo);
    }

    doneTodo(id: number): string {
        const todo = todos.find((todo) => todo.id == id);
        todo.done = true;
        return JSON.stringify(todo);
    }

    deleteTodo(id: number): string {
        todos = todos.filter((todo) => todo.id != id);
        return JSON.stringify(todos);
    }
}
