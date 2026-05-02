import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DateTime } from "luxon";

@Injectable()
export class AttendanceService {
    constructor(private prisma: PrismaService) { }

    //Récupère les horaires de tous les utilisateurs
    async getAllAttendances() {
        try {
            const allAttendances = await this.prisma.attendances.findMany({
                include: {
                    User: true,
                    Planning: true,
                    Salary: true,
                    Enterprise: true
                } as any
            });

            if (allAttendances.length === 0) {
                return {
                    status: false,
                    message: "Aucune donnée trouvée",
                }
            }

            console.log({
                message: "Voici la liste des présences enregistrée",
                datas: allAttendances,
            });

            return {
                status: true,
                message: "Voici la liste des présences enregistrée",
                datas: allAttendances,
            }
        } catch (error) {
            console.error(error);
            return {
                status: false,
                message: "Une erreur est survenue. Veuillez contacter votre administrateur.",
                error
            }
        }
    }

    //Récupère les horaires d'un utilisateur en fonction de son ID
    async getAttendances(id: number) {
        try {
            const allAttendances = await this.prisma.attendances.findMany({
                where: { UserId: id },
                include: {
                    User: true,
                    Planning: true,
                    Salary: true,
                    Enterprise: true
                } as any
            });

            if (allAttendances.length === 0) {
                return {
                    status: false,
                    message: "Aucune donnée trouvée",
                }
            }


            console.log({
                message: "Voici la liste des présences enregistrée",
                datas: allAttendances,
            });

            return {
                status: true,
                message: "Voici la liste des présences enregistrée",
                datas: allAttendances,
            }
        } catch (error) {
            console.error(error);
            return {
                status: false,
                message: "Une erreur est survenue. Veuillez contacter votre administrateur.",
                error
            }
        }
    }

    //Récupère les horaire de l'utilisateur selon le jour courant
    async getAttendancesOfToday(id: number) {
        try {
            const now = new Date();

            const startToday = new Date(now);
            startToday.setHours(0, 0, 0, 0);

            const endToday = new Date(now);
            endToday.setHours(23, 59, 59, 999);

            const attendances = await this.prisma.attendances.findFirst({
                where: {
                    UserId: id,
                    createdAt: {
                        gte: startToday,
                        lte: endToday
                    }
                },
                include: {
                    User: true,
                    Planning: true,
                    Salary: true,
                    Enterprise: true
                } as any
            });

            if (!attendances) {
                return {
                    status: false,
                    message: "Aucune donnée trouvée",
                }
            }

            console.log({
                message: "Présence enregistrée",
                datas: attendances,
            });

            return {
                status: true,
                message: "Présence enregistrée",
                datas: attendances,
            }
        } catch (error) {
            console.error(error);
            return {
                status: false,
                message: "Une erreur est survenue. Veuillez contacter votre administrateur.",
                error
            }
        }
    }

    //Enregistré ou modifier les horaires des collaborateur
    async postAttendances(UserId: number, EnterpriseId: number | null, SalaryId: number | null, PlanningId: number | null, field: string) {
        try {
            const now = new Date();

            const startToday = new Date(now);
            startToday.setHours(0, 0, 0, 0);

            const endToday = new Date(now);
            endToday.setHours(23, 59, 59, 999);

            const timeZone = DateTime.now().setZone('Africa/Brazzaville');
            const timeFormat = timeZone.toFormat('HH:mm');

            const attendances = await this.prisma.attendances.findFirst({
                where: {
                    UserId,
                    createdAt: {
                        gte: startToday,
                        lte: endToday
                    }
                },
            });

            const planning = await this.prisma.plannings.findUnique({
                where: {
                    id: PlanningId ?? 8
                }
            })

            const startTime = planning?.startTime?.toString().slice(0, 5);
            const endTime = planning?.endTime?.toString().slice(0, 5);

            let status = "";

            if (timeFormat <= String(startTime)) {
                status = "A temps";
            } else if (timeFormat > String(startTime)) {
                status = "En retard";
            } else {
                status = "Absent";
            }

            if (!attendances) {
                if (field === "arrivalTime") {
                    const attendance = await this.prisma.attendances.create({
                        data: {
                            UserId,
                            arrivalTime: timeFormat,
                            EnterpriseId,
                            SalaryId,
                            PlanningId,
                            mounth: new Date().getMonth(),
                            status,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        } as any
                    });
                    console.log({
                        title: "Félicitations!",
                        message: "Horaires d'arrivée enregistrée avec succès!", attendance
                    })
                    return {
                        status: true,
                        title: "Félicitations!",
                        message: "Horaires d'arrivée enregistrée avec succès!"
                    }
                }
            } else {
                const attendance = await this.prisma.attendances.updateMany({
                    data: {
                        [field]: timeFormat,
                    },
                    where: {
                        UserId,
                        createdAt: {
                            gte: startToday,
                            lte: endToday
                        }
                    }
                })

                if (attendance.count === 0) {
                    return {
                        status: false,
                        title: "Opérattion échouée",
                        message: "Veuillez contacter votre administrateur pour plus d'infos"
                    }
                }

                return {
                    status: true,
                    title: "Félicitations!",
                    message: "Horaires enregistrées avec succès",
                }
            }
        } catch (error) {
            console.error(error);
            return {
                status: false,
                title: "Erreur!",
                message: "Une erreur est survenue. Veuillez contacter votre administrateur.",
                error
            }
        }

    }
}
