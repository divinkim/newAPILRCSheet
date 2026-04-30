import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/api')
export class UserController {
    constructor(private service: UserService) { }

    @Get("/getUser/:id")
    getUser(@Param('id') id: string) {
        return this.service.getUser(Number(id))
    };

    @Get("/getUsers")
    getUsers() {
        return this.service.getUsers();
    }
}
