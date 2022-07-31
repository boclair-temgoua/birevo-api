import { Contact } from '../../../../models/Contact';
import { Injectable } from '@nestjs/common';
// import { ContactService } from './../../../contact.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

const testFirstName1 = 'First 1';
const testLastName1 = 'Last 1';

const contactArray = [
  {
    id: '2',
    uuid: 'b2e3c07a-7353-4ddb-accc-86d93181412a',
    slug: 'dtyfytafrta',
    lastName: 'Temgoua2',
    email: 'temgo@yahoo.it',
  },
  {
    id: '1',
    uuid: 'a4b27eb5-4099-4bbc-b99b-f1384ee652db',
    slug: 'dtyfytafrta',
    lastName: 'Temgoua',
    email: 'temgo@yahoo.fr',
  },
  // new Person(testFirstName1, testLastName1, 22),
  // new Person('First 2', 'Last 2', 22),
  // new Person('First 3', 'Last 3', 22),
];

const oneContact = {
  id: '2',
  uuid: 'b2e3c07a-7353-4ddb-accc-86d93181412a',
  slug: 'dtyfytafrta',
  lastName: 'Temgoua2',
  email: 'temgo@yahoo.it',
};
// const deletedResult = new DeleteResult();
// deletedResult.affected = 1;

describe('ContactService', () => {
  // let service: ContactService;
  // let repo: Repository<Contact>;
  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [
  //       ContactService,
  //       {
  //         provide: getRepositoryToken(Contact),
  //         useValue: {
  //           find: jest.fn().mockResolvedValue(contactArray),
  //           findOneBy: jest.fn().mockResolvedValue(oneContact),
  //           create: jest.fn().mockResolvedValue(oneContact),
  //           save: jest.fn().mockResolvedValue(oneContact),
  //           update: jest.fn().mockResolvedValue(oneContact),
  //           delete: jest.fn().mockResolvedValue(oneContact),
  //         },
  //       },
  //     ],
  //   }).compile();
  //   service = module.get<ContactService>(ContactService);
  //   repo = module.get<Repository<Contact>>(getRepositoryToken(Contact));
  // });
  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });
  // describe('getAllPeople', () => {
  //   it('should return an array of persons', async () => {
  //     const persons = await service.findAllContacts({});
  //     expect(persons).toEqual(contactArray);
  //   });
  // });
  // describe('getPersonById', () => {
  //   it('should get a single person', () => {
  //     const repoSpy = jest.spyOn(repo, 'findOneBy');
  //     expect(service.getPersonById(1)).resolves.toEqual(onePerson);
  //     expect(repoSpy).toBeCalledWith({ id: 1 });
  //   });
  // });
  // describe('createPerson', () => {
  //   it('should successfully create a person', async () => {
  //     const createPersonDto = {
  //       firstName: testFirstName1,
  //       lastName: testLastName1,
  //       age: 22,
  //     };
  //     const person = await service.createPerson(createPersonDto);
  //     expect(person).toEqual(onePerson);
  //     expect(repo.create).toBeCalledTimes(1);
  //     expect(repo.create).toBeCalledWith(createPersonDto);
  //     expect(repo.save).toBeCalledTimes(1);
  //   });
  // });
  // describe('updatePerson', () => {
  //   it('should call the update method', async () => {
  //     const updatePersonDto = {
  //       firstName: testFirstName1,
  //       lastName: testLastName1,
  //       age: 22,
  //     };
  //     const person = await service.updatePerson(1, updatePersonDto);
  //     expect(person).toEqual(onePerson);
  //     expect(repo.update).toBeCalledTimes(1);
  //     expect(repo.update).toBeCalledWith(1, updatePersonDto);
  //   });
  // });
  // describe('deletePerson', () => {
  //   it('should return {deleted: true} if deleted', () => {
  //     expect(service.deletePerson(1)).resolves.toEqual({ deleted: true });
  //   });
  //   it('should return an http exception if no matches found', () => {
  //     const repoSpy = jest
  //       .spyOn(repo, 'delete')
  //       .mockRejectedValueOnce(
  //         new HttpException('Person not found', HttpStatus.NOT_FOUND),
  //       );
  //     expect(service.deletePerson(1)).rejects.toThrow('Person not found');
  //     expect(repoSpy).toBeCalledWith({ id: 1 });
  //     expect(repoSpy).toBeCalledTimes(1);
  //   });
  // });
});
