import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { RbcaService } from 'src/application/services/rbca/rbca.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly rbcaService: RbcaService) {

    }

    @Get('test')
    @UseInterceptors(CacheInterceptor)
    test() {
        return this.rbcaService.getAllRoles();
    }
}
