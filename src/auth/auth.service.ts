import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Client } from 'src/42.js';
import { AuthProcess } from 'src/42.js/auth/auth_manager';
import { LoggedUser } from 'src/42.js/structures/logged_user';
import { PannelUser } from 'src/types/user.model';

let users: PannelUser[] = [{ id: 1, login: 'dhubleur' }];

@Injectable()
export class AuthService {
    private _auth_processes: AuthProcess;
    private _client: Client;
    constructor(private jwtTokenService: JwtService) {
        this._client = new Client(
            <string>process.env.CLIENT_ID,
            <string>process.env.CLIENT_SECRET,
        );
    }

    get client(): Client {
        return this._client;
    }

    async get_auth_processes(): Promise<AuthProcess> {
        if (!this._auth_processes) {
            this._auth_processes =
                await this._client.auth_manager.init_auth_process(
                    'http://localhost:3000/auth/callback',
                    ['public'],
                );
        }
        return this._auth_processes;
    }

    async findUser(id: number): Promise<PannelUser> {
        return users.find((user) => user.id === id);
    }

    async validateAuth(user: LoggedUser): Promise<string> {
        let pannelUser = await this.findUser(user.id);
        if (!pannelUser) {
            pannelUser = {
                id: users.length,
                login: user.login,
            };
            users.push(pannelUser);
        }
        const token = this.getAccessToken(pannelUser);
        const refreshToken = this.getRefreshToken(pannelUser);
        return JSON.stringify({
            access_token: {
                value: token,
                expires_in: 180,
            },
            refresh_token: refreshToken,
        });
    }

    getAccessToken(user: PannelUser): string {
        return this.jwtTokenService.sign({
            ...user,
            type: 'access',
        });
    }

    getRefreshToken(user: PannelUser): string {
        return this.jwtTokenService.sign(
            {
                ...user,
                type: 'refresh',
            },
            { expiresIn: '30d' },
        );
    }

    async refresh(refreshToken: string): Promise<string> {
        try {
            const user = this.jwtTokenService.verify(refreshToken);
            if (
                !user.type ||
                !user.id ||
                !user.login ||
                user.type !== 'refresh'
            ) {
                throw new Error('Invalid token');
            }
            console.log(`Refresh token for: ${user.login}`);
            return JSON.stringify({
                token: this.getAccessToken(await this.findUser(user.id)),
                expires_in: 180,
            });
        } catch (e) {
            throw new Error('Invalid refresh token');
        }
    }

    async verifyAccessToken(token: string): Promise<PannelUser> {
        try {
            const user = this.jwtTokenService.verify(token);
            if (
                !user.type ||
                !user.id ||
                !user.login ||
                user.type !== 'access'
            ) {
                throw new Error('Invalid token');
            }
            return await this.findUser(user.id);
        } catch (e) {
            throw new Error('Invalid access token');
        }
    }
}
