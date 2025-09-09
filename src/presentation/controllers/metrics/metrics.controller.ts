// my-custom-controller.ts
import { Controller, Get, Res } from "@nestjs/common";
import { PrometheusController } from "@willsoto/nestjs-prometheus";
import { type Response } from "express";

@Controller()
export class MetricsController extends PrometheusController {
    @Get()
    async index(@Res({ passthrough: true }) res: Response) {
        // Métricas de la app (PrometheusController original)
        const appMetrics = await super.index(res);

        // Métricas de Node Exporter
        const nodeMetrics = await fetch("http://127.0.0.1:9100/metrics").then((r) =>
            r.text()
        );

        return `${appMetrics}\n${nodeMetrics}`;

    }
}