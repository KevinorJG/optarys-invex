import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator
} from '@nestjs/terminus';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { platform } from 'os';

const rootPath = platform() === 'win32' ? 'C:\\' : '/';
@Controller('healt')
export class HealtController {
  constructor(
    @InjectDataSource('TenantContext') private readonly dataSource: DataSource,
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator
  ) { }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Verifica la conexión a Postgres usando el DataSource directamente
      () => this.db.pingCheck('postgres', { connection: this.dataSource }),

      // Verifica la memoria RSS (alerta si > 200MB)
      () => this.memory.checkRSS('memory_rss', 200 * 1024 * 1024),

      // Verifica espacio en disco en la carpeta raíz
      //() => this.disk.checkStorage('disk', { path: rootPath, thresholdPercent: 0.5 }),
    ]);
  }
}