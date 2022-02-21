import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from 'src/app/users/dto/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }
    @ApiOkResponse({ description: "User authorized" })
    @ApiBadRequestResponse({ description: "Invalid Credentials" })
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return await this.authService.login(loginUserDto.username);
    }
}
