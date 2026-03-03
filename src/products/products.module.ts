import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller.js";
import { ProductsService } from "./products.service.js";
import { PrismaService } from "../prisma.service.js";
import { CategoriesService } from "../categories/categories.service.js";

@Module({
    controllers: [ProductsController],
    providers: [ProductsService, CategoriesService, PrismaService],
})
export class ProductsModule {}