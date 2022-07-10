import { Injectable } from "@nestjs/common";
import { Logger } from "../../logging/Logger";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ErrorCodes } from "../../utils/error-codes";
import { ResponseUtils } from "../../utils/ResponseUtils";
import { HttpException } from "../../utils/HttpException";
import { BaseService } from "../_base/base.service";
import { CreateUserDto, UpdateUserDto, UserDto, UserEntity } from "../../models/user";
import { AddressDto, AddressEntity, CreateAddressDto } from "../../models/address";

@Injectable()
export class UsersService extends BaseService<UserEntity, UserDto, CreateUserDto, UpdateUserDto> {
  private logger = new Logger("UsersService");

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(AddressEntity)
    private readonly addressesRepository: Repository<AddressEntity>,
  ) {
    super(UserDto, CreateUserDto, UpdateUserDto, usersRepository);
  }

  async create(dto: CreateUserDto): Promise<UserDto> {
    this.logger.debug(`Creating user ${dto.username}`, { data: { dto } });
    return super.create(dto);
  }

  async createBulk(dtos: CreateUserDto[]): Promise<UserDto[]> {
    this.logger.debug(`Creating ${dtos.length} users`, { data: { dtos } });
    return super.createBulk(dtos);
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserDto> {
    this.logger.debug(`Updating user ${id}`, { data: { dto } });
    return super.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    this.logger.debug(`Deleting user ${id}`, { data: { id } });
    await super.delete(id);
  }

  async createAddress(id: number, dto: CreateAddressDto): Promise<AddressDto> {
    this.logger.debug(`Creating address for user ${id}`, { data: { dto } });

    const user = await this.usersRepository.findOne({ id });
    if (user === undefined) {
      throw new HttpException(404, `The user ${id} does not exist`, ErrorCodes.INVALID_USER);
    }

    const address = AddressEntity.fromCreateDto(user, dto);
    const created = await this.addressesRepository.save(address);

    return ResponseUtils.cleanObject(AddressDto, created);
  }
}
