import { IsString, MaxLength, MinLength } from 'class-validator';

export interface Todo {
    id: number;
    title: string;
    description: string;
    done: boolean;
}

export class CreateTodoDto {
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    title: string;

    @IsString()
    @MinLength(1)
    description: string;
}
