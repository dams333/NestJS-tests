import {
    BadRequestException,
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Query,
    Res,
} from '@nestjs/common';
import { Client } from 'src/42.js/structures/client';
import { AuthProcess } from 'src/42.js/auth/auth_manager';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    private _auth_processes: AuthProcess | null = null;
    private _client: Client;
    constructor(private readonly authService: AuthService) {
        this._client = new Client(
            <string>process.env.CLIENT_ID,
            <string>process.env.CLIENT_SECRET,
        );
    }

    @Get()
    async redirectToAuth(@Res() res) {
        if (!this._auth_processes) {
            this._auth_processes =
                await this._client.auth_manager.init_auth_process(
                    'http://localhost:3000/auth/callback',
                    ['public', 'projects', 'profile'],
                );
        }
        res.redirect(this._auth_processes.url);
    }

    @Get('callback')
    async callback(@Query('code') code: string): Promise<string> {
        if (!code) {
            throw new BadRequestException('No code provided');
        }
        if (!this._auth_processes) {
            throw new InternalServerErrorException('No auth process found');
        }
        const user = await this._client.auth_manager.response_auth_process(
            this._auth_processes.id,
            code,
        );
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return `Welcome ${user.login}`;
    }
}
