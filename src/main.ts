import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const isProd = process.env.NODE_ENV === 'production';

  const app = isProd
    ? await NestFactory.create(AppModule, {
      httpsOptions: {
        key: require('fs').readFileSync('/etc/letsencrypt/live/vps118934.serveur-vps.net/privkey.pem'),
        cert: require('fs').readFileSync('/etc/letsencrypt/live/vps118934.serveur-vps.net/fullchain.pem'),
      },
    })
    : await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();