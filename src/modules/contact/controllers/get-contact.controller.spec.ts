// import { FindContactService } from '../services/query/find-contact.service';
// import { GetContactController } from './get-contact.controller';
// import { Test } from '@nestjs/testing';

// describe('GetContactController', () => {
//   let getContactController: GetContactController;
//   let findContactService: FindContactService;

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       controllers: [GetContactController],
//       providers: [FindContactService],
//     }).compile();

//     findContactService = moduleRef.get<FindContactService>(FindContactService);
//     getContactController =
//       moduleRef.get<GetContactController>(GetContactController);
//   });

//   // beforeEach(() => {
//   //   getContactController = GetContactController();
//   //   // catsService = new CatsService();
//   //   // catsController = new CatsController(catsService);
//   // });

//   describe('getAllContacts', () => {
//     it('should return an array of cats', async () => {
//       const result = ['test'];
//       // jest.spyOn(catsService, 'findAll').mockImplementation(() => result);

//       // expect(await catsController.findAll()).toBe(result);
//     });
//   });
// });
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrUpdateContactDto } from '../dto/validation-contact.dto';
import { FindContactService } from '../services/query/find-contact.service';
import { GetContactController } from './get-contact.controller';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UsersController } from './users.controller';
// import { UsersService } from './users.service';

// const createOrUpdateContactDto: CreateOrUpdateContactDto = {
//   firstName: 'firstName #1',
//   lastName: 'lastName #1',
// };

describe('GetContactController', () => {
  let getContactController: GetContactController;
  let findContactService: FindContactService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GetContactController],
      providers: [
        FindContactService,
        {
          provide: FindContactService,
          useValue: {
            // create: jest
            //   .fn()
            //   .mockImplementation((user: CreateOrUpdateContactDto) =>
            //     Promise.resolve({ id: '1', ...user }),
            //   ),
            findAll: jest.fn().mockResolvedValue([
              {
                id: '45',
                uuid: 'a9c304fd-bc8a-4364-b233-8b38970cdd0b',
                slug: 'eNW6XfPZcCGecq5B4MocFb45muLa6X',
                lastName: null,
                email: 'edmud@gmail.cm',
              },
              {
                uuid: '7c935741-5ff3-42ca-a2f6-b6ba417f866b',
                slug: 'eNW6XfPyyyewZcCGecq5B4MocFb45muLa6X',
                lastName: null,
                email: 'etemgoua@gmail.cm',
              },
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id: '45',
                uuid: 'a9c304fd-bc8a-4364-b233-8b38970cdd0b',
                slug: 'eNW6XfPZcCGecq5B4MocFb45muLa6X',
                lastName: null,
                email: 'edmud@gmail.cm',
              }),
            ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    getContactController = app.get<GetContactController>(GetContactController);
    findContactService = app.get<FindContactService>(FindContactService);
  });

  it('should be defined', () => {
    expect(getContactController).toBeDefined();
  });

  // describe('create()', () => {
  //   it('should create a user', () => {
  //     usersController.create(createUserDto);
  //     expect(usersController.create(createUserDto)).resolves.toEqual({
  //       id: '1',
  //       ...createUserDto,
  //     });
  //     expect(usersService.create).toHaveBeenCalledWith(createUserDto);
  //   });
  // });

  // describe('findAll()', () => {
  //   it('should find all contacts ', () => {
  //     getContactController.getAllContact({filterQuery: 'test', pagination: {limit:1,page:1, sort: 'DESC'}}).;
  //     expect(findContactService.findAllContacts).toHaveBeenCalled();
  //   });
  // });

  // describe('findOne()', () => {
  //   it('should find a user', () => {
  //     expect(usersController.findOne(1)).resolves.toEqual({
  //       firstName: 'firstName #1',
  //       lastName: 'lastName #1',
  //       id: 1,
  //     });
  //     expect(usersService.findOne).toHaveBeenCalled();
  //   });
  // });

  // describe('remove()', () => {
  //   it('should remove the user', () => {
  //     usersController.remove('2');
  //     expect(usersService.remove).toHaveBeenCalled();
  //   });
  // });
});
