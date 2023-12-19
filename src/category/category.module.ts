import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import { Category } from './entities/category.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}

/* В блоке imports вы указываете модули, которые используются внутри вашего модуля. Давайте рассмотрим каждый из них:

TypeOrmModule.forFeature([Category]): Здесь вы добавляете TypeOrmModule с использованием метода forFeature, чтобы зарегистрировать Category как сущность базы данных, доступную внутри этого модуля.

UserModule: Этот модуль вы используете, чтобы иметь доступ к UserService и другим зависимостям, определенным в UserModule. Также, возможно, вы используете сущности, определенные в UserModule.


TypeOrmModule.forFeature([User]): Также, как и в первом случае, здесь вы добавляете TypeOrmModule с использованием метода forFeature, чтобы зарегистрировать User как сущность базы данных, доступную внутри этого модуля.

Таким образом, блок imports объединяет необходимые модули и их функциональности, чтобы ваш CategoryModule мог использовать их внутри себя. */
