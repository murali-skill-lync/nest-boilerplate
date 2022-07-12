/* eslint-disable max-nested-callbacks,max-lines-per-function */
import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddressDto, AddressEntity, CreateAddressDto } from "../../models/address";
import { CreateUserDto, UserEntity } from "../../models/user";
import { emptyCtx } from "../../decorators/request-context.decorator";

describe("UsersService", () => {
  let usersService: UsersService;
  let usersRepository: Repository<UserEntity>;
  let addressRepository: Repository<AddressEntity>;

  const createAddressDto: CreateAddressDto = {
    city: "Nairobi",
    country: "Kenya",
  };
  const address: AddressDto = { id: 1, city: "Nairobi", country: "Kenya" };
  const createUserDto = {
    username: "Mark",
    contact: {
      email: "mark@mail.com",
    },
  };
  const user = {
    id: 1,
    username: "Mark",
    contact: {
      email: "mark@mail.com",
    },
    addresses: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AddressEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(UserEntity));
    addressRepository = module.get(getRepositoryToken(AddressEntity));
  });

  describe("getAllUsers", () => {
    it("should return an array", async () => {
      jest
        .spyOn(usersRepository, "find")
        .mockImplementation(async () => Promise.resolve([user as any as UserEntity]));

      const actual = await usersService.list(emptyCtx());
      expect(actual).toEqual([user]);
    });
  });

  describe("createUser", () => {
    it("should return an object", async () => {
      jest
        .spyOn(usersRepository, "save")
        .mockImplementation(async () => Promise.resolve(user as any as UserEntity));

      const actual = await usersService.create(emptyCtx(), createUserDto as CreateUserDto);
      expect(actual).toEqual(user);
    });
  });

  describe("createAddress", () => {
    it("should return an object", async () => {
      jest
        .spyOn(addressRepository, "save")
        .mockImplementation(async () => Promise.resolve(address as AddressEntity));

      jest
        .spyOn(usersRepository, "findOne")
        .mockImplementation(async () => Promise.resolve(user as any as UserEntity));

      const actual = await usersService.createAddress(emptyCtx(), 1, createAddressDto);
      expect(actual).toEqual(address);
    });
  });
});
