import { Controller, Injectable, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('/api')
export class LoginController {
    constructor(private service: LoginService) { }

    @Post("/login")
    authenticate(@Body() body: { email: string, password: string }) {
        return this.service.authenticate(body.email, body.password)
    }
}
