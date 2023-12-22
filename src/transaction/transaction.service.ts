import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Transaction } from './entities/transaction.entity'
import { Repository } from 'typeorm'

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, id: number) {
    console.log('*************', id)
    const newTramsaction = {
      title: createTransactionDto.title,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      category: { id: +createTransactionDto.category },
      user: { id },
    }
    if (!newTramsaction) throw new BadRequestException('Something went wrong..')
    return await this.transactionRepository.save(newTramsaction)
  }

  async findAll(id: number) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id },
      },
      order: {
        createdAt: 'DESC', //сортировка, новые- первые
      },
    })
    return transactions
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        user: true,
        category: true,
      },
    })
    if (!transaction) throw new NotFoundException('Transaction not found')
    return transaction
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id: id,
      },
    })
    if (!transaction) throw new NotFoundException('Transaction not found')
    return await this.transactionRepository.update(id, updateTransactionDto)
  }

  async remove(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id: id,
      },
    })
    if (!transaction) throw new NotFoundException('Transaction not found')
    return await this.transactionRepository.delete(id)
  }

  async findAllWithPagination(id: number, page: number, limit: number) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id },
      },
      relations: {
        user: true,
        category: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit, //взять только сколько укажем в limit
      skip: (page - 1) * limit, //сколько результотов пропустить, для того вывести только те, что мы просим
    })
    return transactions
  }
}
