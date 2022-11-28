import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { CreateTokenDto } from 'src/types/token.model';
import { AccessGuard, AuthGuard } from './auth.guard';
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

    @Get('logged')
    @UseGuards(AuthGuard)
    testLog(): string {
        return JSON.stringify({ message: 'You are logged' });
    }

    @Get('access/:access')
    @UseGuards(AuthGuard)
    async testAccess(
        @Param('access') access: string,
        @Req() req,
    ): Promise<string> {
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader) {
            try {
                const token = authorizationHeader.replace('Bearer ', '');
                const user = await this.authService.verifyAccessToken(token);
                if (user && user.access.includes(access)) {
                    return JSON.stringify({ message: 'You have access' });
                }
            } catch (e) {
                throw new ForbiddenException('Invalid access');
            }
        }
        throw new ForbiddenException('Invalid access');
    }
}
