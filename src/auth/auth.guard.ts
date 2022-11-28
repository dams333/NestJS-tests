import {
    CanActivate,
    ExecutionContext,
    Injectable,
    mixin,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers.authorization;
        if (authorizationHeader) {
            try {
                const token = authorizationHeader.replace('Bearer ', '');
                const user = await this.authService.verifyAccessToken(token);
                if (user) {
                    return true;
                }
            } catch (e) {
                return false;
            }
        }
        return false;
    }
}

export const AccessGuard = (access: string) => {
    @Injectable()
    class AccessGuardMixin implements CanActivate {
        constructor(readonly authService: AuthService) {}

        async canActivate(context: ExecutionContext): Promise<boolean> {
            const request = context.switchToHttp().getRequest();
            const authorizationHeader = request.headers.authorization;
            if (authorizationHeader) {
                try {
                    const token = authorizationHeader.replace('Bearer ', '');
                    const user = await this.authService.verifyAccessToken(
                        token,
                    );
                    if (user && user.access.includes(access)) {
                        return true;
                    }
                } catch (e) {
                    console.error(e);
                    return false;
                }
            }
            return false;
        }
    }
    const guard = mixin(AccessGuardMixin);
    return guard;
};
