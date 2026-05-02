import { Controller, Param, Get, Post, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('/api')
export class AttendanceController {
    constructor(private service: AttendanceService) { }

    @Get('/getAllAttendances')
    getAllAttendances() {
        return this.service.getAllAttendances();
    }

    @Get('/getAttendances/:id')
    getAttendances(@Param('id') id: string) {
        return this.service.getAttendances(Number(id));
    }

    @Get('/getAttendancesOfToday/:id')
    getAttendancesOfToday(@Param('id') id: string) {
        return this.service.getAttendancesOfToday(Number(id));
    }

    @Post('/postAttendances')
    postAttendances(@Body() body: { UserId: number, EnterpriseId: number | null, SalaryId: number | null, PlanningId: number | null, field: string }) {

        const UserId = body.UserId;
        const EnterpriseId = body.EnterpriseId;
        const SalaryId = body.SalaryId;
        const PlanningId = body.PlanningId;
        const field = body.field;
       
        return this.service.postAttendances(UserId, EnterpriseId, SalaryId, PlanningId, field);
    }
}
