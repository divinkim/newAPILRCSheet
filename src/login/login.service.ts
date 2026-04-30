import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

@Injectable()
export class LoginService {
    constructor(private prisma: PrismaService) { }

    async authenticate(email: string, password: string) {
        try {
            const user = await this.prisma.employees.findFirst({ where: { email } });

            if (!user) {
                return {
                    status: false,
                    title: "Recherche non aboutie",
                    message: "Aucun utilisateur correspondant. Veuilez réessayer",
                }
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return {
                    status: false,
                    title: "Mot de passe invalide",
                    message: "Veuillez réessayer"
                }
            }

            const TOKEN = process.env.TOKEN;

            const token = jwt.sign(
                { id: user.id },
                String(TOKEN),
                {}
            );

            const getEnterprise = await this.prisma.enterprises.findFirst({
                where: { id: Number(user?.EnterpriseId) }
            });

            return {
                status: true,
                message: "Authentification réussie",
                token,
                user: {
                    firstname: user?.firstname,
                    lastname: user?.lastname,
                    EnterpriseId: user?.EnterpriseId,
                    UserId: user?.id,
                    latitude: getEnterprise?.latitude,
                    longitude: getEnterprise?.longitude,
                }
            }
        } catch (error) {
            console.log(error);
            return {
                status: false,
                title: "Erreur inattendue!",
                message: "Une erreur est survenue. Veuillez consulter votre administrateur.",
            }
        }
    }
}
