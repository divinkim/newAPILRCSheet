import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

@Injectable()
export class LoginService {
    constructor(private prisma: PrismaService) { }

    async authenticate(email: string, password: string) {
        // const passwordRegex = /^[a-zA-Z0-9+@_!*]{4,}$/;
        // const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,}$/;

        // if (!emailRegex.test(email)) {
        //     return {
        //         status: false,
        //         title: "Champ invalide!",
        //         message: "Veuillez saisir une adresse mail valide."
        //     }
        // } else if (!passwordRegex.test(password)) {
        //     return {
        //         status: false,
        //         title: "Champ invalide!",
        //         message: "Veuillez saisir un mot de passe valide."
        //     }
        // }

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
            { expiresIn: undefined }
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
                longitude: getEnterprise?.longitude
            }
        }
    }
}
