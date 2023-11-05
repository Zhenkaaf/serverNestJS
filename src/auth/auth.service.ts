import { UserService } from './../user/user.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as argon2 from 'argon2'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email)
    const passwordIsMatch = await argon2.verify(user.password, password)
    if (user && passwordIsMatch) {
      return user
    }
    //return null;
    throw new UnauthorizedException('User or password are incorrect')
  }
}
