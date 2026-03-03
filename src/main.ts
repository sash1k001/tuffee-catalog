import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { HttpToRpcExceptionFilter } from "./common/filters/http-to-rpc.filter.js";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3001,
      },
    },
  );

  app.useGlobalFilters(new HttpToRpcExceptionFilter());

  await app.listen();
  console.log(`catalog service запущен на порту 3001`);
}

bootstrap();