import { Controller, Get, HttpCode } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type PostgresHealthStatus = 'saludable' | 'medio' | 'requiere_revision' | 'error';

@Controller('healt')
export class HealtController {
  constructor(
    @InjectDataSource('TenantContext') private readonly dataSource: DataSource
  ) {}

  @Get('postgres')
  @HttpCode(200)
  async checkPostgres(): Promise<{
    status: PostgresHealthStatus,
    detail?: string,
    durationMs: number,
    timestamp: string
  }> {
    const start = process.hrtime.bigint();
    let status: PostgresHealthStatus = 'saludable';
    let detail: string | undefined = undefined;

    try {
      await this.dataSource.query('SELECT 1');
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1_000_000;

      // Umbrales de ejemplo:
      if (durationMs < 100) {
        status = 'saludable';
      } else if (durationMs < 500) {
        status = 'medio';
        detail = 'La respuesta fue más lenta de lo esperado.';
      } else {
        status = 'requiere_revision';
        detail = 'La consulta demoró demasiado, posible problema de rendimiento.';
      }

      return {
        status,
        detail,
        durationMs,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      status = 'error';
      detail = error.message;
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1_000_000;

      return {
        status,
        detail,
        durationMs,
        timestamp: new Date().toISOString(),
      };
    }
  }
}