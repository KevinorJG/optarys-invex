import { Controller, Get } from '@nestjs/common';
import { RbcaService } from 'src/application/services/rbca/rbca.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly rbcaService: RbcaService) {

    }

    @Get('test')
    test() {
        return this.rbcaService.getAllRoles();
    }
}
