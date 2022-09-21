import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = async () => {
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('/api/v1');

    //Interceptor for transform response
    app.useGlobalInterceptors(new TransformInterceptor());

    //Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('Rest Car')
      .setDescription('The API documentation of "rest_car app"')
      .setVersion('1.0')
      .build();
    //Create swagger API documentation
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/docs', app, document);

    await app.listen(PORT);
  } catch (e) {
    console.log(e);
  }
};
//Starting the app
app().then(() => console.log(`Server was started on post: ${PORT}`));
