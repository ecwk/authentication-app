import { DynamicModule, Module } from '@nestjs/common';

import { S3ModuleAsyncOptions, S3ModuleOptions } from './s3.interfaces';
import { S3CoreModule } from './s3-core.module';

@Module({})
export class S3Module {
  static forRoot(options: S3ModuleOptions): DynamicModule {
    return {
      module: S3Module,
      imports: [S3CoreModule.forRoot(options)],
      exports: [S3CoreModule]
    };
  }

  static forRootAsync(options: S3ModuleAsyncOptions): DynamicModule {
    return {
      module: S3Module,
      imports: [S3CoreModule.forRootAsync(options)],
      exports: [S3CoreModule]
    };
  }
}
