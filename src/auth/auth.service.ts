import { Injectable } from '@nestjs/common';
import { User } from 'src/app/users/entities/user.entity';
import { UsersService } from '../app/users/users.service'
import { compareSync } from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService, private readonly jawtService: JwtService) { }

    async login(user) {
        const payload = {
            sub: user._id,
            username: user.username
        }

        return { token: this.jawtService.sign(payload) };
    }

    async validateUser(username: string, password: string) {
        let user: User;
        try {
            user = await this.usersService.searchUserByUsername(username);
        } catch (error) {
            return null;
        }
        if (!user) {
            return null;
        }
        const isPasswordValid = compareSync(password, user.password);
        if (!isPasswordValid) {
            console.log("Wrong password")
            return null;
        }
        console.log("sending user")
        return user;
    }
}
