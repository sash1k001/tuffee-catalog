import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CategoriesService } from "./categories.service.js";
import { CreateCategoryDto } from "./dto/create-category.dto.js";
import { UpdateCategoryDto } from "./dto/update-category.dto.js";

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @MessagePattern('categories.create')
    create(@Payload() dto: CreateCategoryDto) {
        return this.categoriesService.create(dto);
    }
    
    @MessagePattern('categories.find_all')
    findAll(@Payload() onlyActive?: string) {
        return this.categoriesService.findAll(onlyActive === 'true');
    }

    @MessagePattern('categories.find_one')
    findOne(@Payload() id: number) {
        return this.categoriesService.findOne(id);
    }

    @MessagePattern('categories.update')
    update(@Payload() payload: {id: number; dto: UpdateCategoryDto}) {
        return this.categoriesService.update(payload.id, payload.dto);
    }

    @MessagePattern('categories.remove')
    remove(@Payload() id: number) {
        return this.categoriesService.remove(id);
    }
}