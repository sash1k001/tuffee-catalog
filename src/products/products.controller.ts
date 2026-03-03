import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ProductsService, ProductsFilter } from "./products.service.js";
import { CreateProductDto } from "./dto/create-product.dto.js";
import { UpdateProductDto } from "./dto/update-product.dto.js";
import { ProductStatus } from "../../generated/prisma/enums.js";

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @MessagePattern('products.create')
    create(@Payload() dto: CreateProductDto) {
        return this.productsService.create(dto);
    }

    @MessagePattern('products.find_all')
    findAll(
        @Payload() payload: {
            categoryId?: string;
            status?: ProductStatus;
            minPrice?: string;
            maxPrice?: string;
        }
    ) {
        const filter: ProductsFilter = {
            ...(payload.categoryId && { categoryId: Number(payload.categoryId) }),
            ...(payload.status && { status: payload.status }),
            ...(payload.minPrice && { minPrice: Number(payload.minPrice) }),
            ...(payload.maxPrice && { maxPrice: Number(payload.maxPrice) })
        };

        return this.productsService.findAll(filter);
    }

    @MessagePattern('products.find_one')
    findOne(@Payload() id: number) {
        return this.productsService.findOne(id);
    }

    @MessagePattern('products.update')
    update(
        @Payload() payload: {
            id: number;
            dto: UpdateProductDto
        }
    ) {
        return this.productsService.update(payload.id, payload.dto);
    }

    @MessagePattern('products.remove')
    remove(@Payload() id: number) {
        return this.productsService.remove(id);
    }
}