import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import { CategoriesService } from "../categories/categories.service.js";
import { CreateProductDto } from "./dto/create-product.dto.js";
import { UpdateProductDto } from "./dto/update-product.dto.js";
import { Product, ProductStatus } from "../../generated/prisma/client.js";

export interface ProductsFilter {
    categoryId?: number;
    status?: ProductStatus;
    minPrice?: number;
    maxPrice?: number;
}

@Injectable()
export class ProductsService {
    constructor(
        private readonly prisma: PrismaService, 
        private readonly categoriesService: CategoriesService
    ) {}

    async create(dto: CreateProductDto): Promise<Product> {
        await this.categoriesService.findOne(dto.categoryId);

        return this.prisma.product.create({
           data: {
            name: dto.name,
            description: dto.description,
            price: dto.price,
            imageUrl: dto.imageUrl,
            status: dto.status ?? ProductStatus.ACTIVE,
            sortOrder: dto.sortOrder ?? 0,
            categoryId: dto.categoryId,
           },
           include: {
            category: true,
           },
        });
    }

    async findAll(filter: ProductsFilter = {}) : Promise<Product[]> {
        const { categoryId, status, minPrice, maxPrice } = filter;

        return this.prisma.product.findMany({
            where: {
                ...(categoryId && { categoryId }),
                ...(status && { status }),
                ...(minPrice !== undefined || maxPrice !== undefined
                    ? {
                        price: {
                            ...(minPrice !== undefined && { gte: minPrice }),
                            ...(maxPrice !== undefined && { lte: maxPrice }),
                        },
                    }
                : {}),
            },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
            include: {
                category: {
                    select: { id: true, name: true },
                },
            },
        });
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });

        if (!product) {
            throw new NotFoundException(`продукт с ID ${id} не найден`);
        }

        return product;
    }

    async update(id: number, dto: UpdateProductDto): Promise<Product> {
        await this.findOne(id);

        if (dto.categoryId) {
            await this.categoriesService.findOne(dto.categoryId);
        }

        return this.prisma.product.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                price: dto.price,
                imageUrl: dto.imageUrl,
                status: dto.status,
                sortOrder: dto.sortOrder,
                categoryId: dto.categoryId,
            },
            include: {
                category: true,
            },
        });
    }

    async remove(id: number): Promise<Product> {
        await this.findOne(id);

        return this.prisma.product.delete({
            where: { id },
        });
    }
}