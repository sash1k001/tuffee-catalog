import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import { CreateCategoryDto } from "./dto/create-category.dto.js";
import { UpdateCategoryDto } from "./dto/update-category.dto.js";
import { Category } from "../../generated/prisma/client.js";

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateCategoryDto): Promise<Category> {
        const existing = await this.prisma.category.findFirst({
            where: { name: dto.name },
        });

        if (existing) {
            throw new ConflictException(`категория с названием "${dto.name}" уже существует`);
        }

        return this.prisma.category.create({
            data: {
                name: dto.name,
                description: dto.description,
                imageUrl: dto.imageUrl,
                sortOrder: dto.sortOrder ?? 0,
                isActive: dto.isActive ?? true,
            },
        });
    }

    async findAll(onlyActive = false): Promise<Category[]> {
        return this.prisma.category.findMany({
            where: onlyActive ? { isActive: true } : undefined,
            orderBy: [{ sortOrder: 'asc'}, { createdAt: 'desc' }],
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
    }

    async findOne(id: number): Promise<Category> {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                products: {
                    where: { status: 'ACTIVE' },
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });

        if (!category) {
            throw new NotFoundException(`категория с ID ${id} не найдена`);
        }

        return category;
    }

    async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
        await this.findOne(id);

        if (dto.name) {
            const existing = await this.prisma.category.findFirst({
                where: {
                    name: dto.name,
                    NOT: { id },
                },
            });

            if (existing) {
                throw new ConflictException(`категория с названием "${dto.name} уже существует"`);
            }
        }

        return this.prisma.category.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                imageUrl: dto.imageUrl,
                sortOrder: dto.sortOrder,
                isActive: dto.isActive,
            },
        });
    }

    async remove(id: number): Promise<Category> {
        await this.findOne(id);
        
        const productsCount = await this.prisma.product.count({
            where: { categoryId: id },
        });

        if (productsCount > 0) {
            throw new ConflictException(`нельзя удалить категорию, у неё есть продуктов ${productsCount}`);
        }

        return this.prisma.category.delete({
            where: { id },
        });
    }
}