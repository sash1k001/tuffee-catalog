import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module.js';
import { ProductsModule } from './products/products.module.js';

@Module({
  imports: [CategoriesModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
