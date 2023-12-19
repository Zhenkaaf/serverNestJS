import { Category } from 'src/category/entities/category.entity'
import { InjectRepository } from '@nestjs/typeorm'
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

import { Repository } from 'typeorm'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, id: number) {
    const isExist = await this.categoryRepository.findBy({
      user: { id: id },
      title: createCategoryDto.title,
    })
    if (isExist.length)
      throw new BadRequestException('This category already exist!')

    const newCategory = {
      title: createCategoryDto.title,
      user: {
        id: id,
      },
    }
    return await this.categoryRepository.save(newCategory)
  }

  async findAll(id: number) {
    return await this.categoryRepository.find({
      where: {
        user: { id: id },
      },
      relations: {
        transactions: true,
      },
    })
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        user: true,
        transactions: true,
      },
    })
    if (!category) throw new NotFoundException('Category not found')
    return category
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    })
    if (!category) throw new NotFoundException('Category not found')
    return await this.categoryRepository.update(id, updateCategoryDto)
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    })
    if (!category) throw new NotFoundException('Category not found')
    await this.categoryRepository.delete(id)

    return `Category with TITLE: ${category.title} has been successfully deleted.`
  }
}
