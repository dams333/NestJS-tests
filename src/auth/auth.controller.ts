import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Post,
    Query,
    Res,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { CreateTokenDto } from 'src/types/token.model';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get()
    async redirectToAuth(@Res() res) {
        res.redirect((await this.authService.get_auth_processes()).url);
    }

    @Get('callback')
    async callback(@Query('code') code: string): Promise<string> {
        if (!code) {
            throw new BadRequestException('No code provided');
        }
        const user =
            await this.authService.client.auth_manager.response_auth_process(
                (
                    await this.authService.get_auth_processes()
                ).id,
                code,
            );
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return await this.authService.validateAuth(user);
    }

    @Post('refresh')
    async refresh(
        @Body(new ValidationPipe()) createToken: CreateTokenDto,
    ): Promise<string> {
        const refreshToken = createToken.refresh_token;
        if (!refreshToken) {
            throw new BadRequestException('No refresh token provided');
        }
        try {
            return await this.authService.refresh(refreshToken);
        } catch (e) {
            throw new BadRequestException('Invalid refresh token');
        }
    }

    @Get('test')
    @UseGuards(AuthGuard)
    test(): string {
        return 'test';
    }
}
