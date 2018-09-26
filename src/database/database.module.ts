import { Module } from '@nestjs/common';
import { DatabaseProvider } from './database.providers';

@Module({
  providers: [...DatabaseProvider],
  exports: [...DatabaseProvider],
})
export class DatabaseModule {}