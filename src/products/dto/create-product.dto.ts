import { IsString, IsOptional, IsInt, IsEnum, Min } from "class-validator";
import { ProductStatus } from "../../../generated/prisma/enums.js";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsInt()
    @Min(0)
    price: number;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsEnum(ProductStatus)
    status?: ProductStatus;

    @IsOptional()
    @IsInt()
    @Min(0)
    sortOrder?: number;
    
    @IsInt()
    categoryId: number;
}