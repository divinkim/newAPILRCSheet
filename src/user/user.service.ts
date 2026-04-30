import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async getUser(id: number) {
        try {
            const user = await this.prisma.employees.findUnique({
                where: { id },
                include: {
                    Enterprise: true,
                    DepartmentPost: true,
                    Post: true,
                    Planning: true,
                    PlanningType: true,
                    ContractType: true,
                    Contract: true,
                    Salary: true,
                    Country: true,
                    City: true,
                    District: true,
                    Quarter: true
                } as any
            });
            if (!user) {
                return {
                    status: false,
                    message: "Aucun collaborateur trouvé"
                }
            }
            console.log({ message: "Collaborateur récupéré avec succès", user })
            return {
                status: true,
                message: "Collaborateur récupéré avec succès",
                datas: user
            }
        } catch (error) {
            console.log(error);
        }

    }
    async getUsers() {
        const users = await this.prisma.employees.findMany({
            include: {
                Enterprise: true,
                DepartmentPost: true,
                Post: true,
                Planning: true,
                PlanningType: true,
                ContractType: true,
                Contract: true,
                Salary: true,
                Country: true,
                City: true,
                District: true,
                Quarter: true
            } as any
        });
        try {
            if (users.length === 0) {
                return {
                    status: false,
                    message: "Aucun collaborateur trouvé"
                }
            }
            console.log({ message: "Collaborateurs récupéré avec succès", users });
            return {
                status: true,
                message: "Collaborateurs récupéré avec succès",
                datas: users
            }
        } catch (error) {
            console.log(error);
        }

    }
}
