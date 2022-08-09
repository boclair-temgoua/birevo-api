import { FindContactService } from '../services/query/find-contact.service';
import { GetContactController } from './get-contact.controller';
import { Test } from '@nestjs/testing';

describe('GetContactController', () => {
  let getContactController: GetContactController;
  let findContactService: FindContactService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GetContactController],
      providers: [FindContactService],
    }).compile();

    findContactService = moduleRef.get<FindContactService>(FindContactService);
    getContactController =
      moduleRef.get<GetContactController>(GetContactController);
  });

  // beforeEach(() => {
  //   getContactController = GetContactController();
  //   // catsService = new CatsService();
  //   // catsController = new CatsController(catsService);
  // });

  describe('getAllContacts', () => {
    it('should return an array of cats', async () => {
      const result = ['test'];
      // jest.spyOn(catsService, 'findAll').mockImplementation(() => result);

      // expect(await catsController.findAll()).toBe(result);
    });
  });
});
