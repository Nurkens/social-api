import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule,DocumentBuilder} from '@nestjs/swagger';
async function bootstrap() {

  
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  

  const config = new DocumentBuilder()
    .setTitle('social API')
    .setDescription('The social API description')
    .setVersion('1.0')
    .addTag('socialAPI')
    .addBearerAuth()
    .build();
    
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api',app,documentFactory)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
