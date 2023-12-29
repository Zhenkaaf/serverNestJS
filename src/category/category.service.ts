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

  async update(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
    userId,
  ) {
    const isExist = await this.categoryRepository.findBy({
      // вернет массив
      user: { id: userId },
      title: updateCategoryDto.title,
    })
    if (isExist.length)
      throw new BadRequestException(
        'Category with such title has already exist!',
      )

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    })
    if (!category) throw new NotFoundException('Category not found')

    /*  if (category.title === updateCategoryDto.title) {
      throw new BadRequestException(
        'Category with such title has already exist!',
      )
    } */

    return await this.categoryRepository.update(categoryId, updateCategoryDto)
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
