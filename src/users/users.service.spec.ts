import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { mock } from "node:test";
import { Repository } from "typeorm";

jest.mock('bcrypt', ()=>({
    hash:jest.fn().mockResolvedValue('hashed_password')
}))

describe('Testing UsersService', () => {
    let service: UsersService;
    let repository:Repository<User>;
    

    beforeEach(async() =>{
        const module: TestingModule = await Test.createTestingModule({
        providers:[
            UsersService,
            {
                provide:getRepositoryToken(User),
                useValue:{
                    findOne:jest.fn(),
                    save:jest.fn(),
                    create:jest.fn().mockImplementation(dto =>dto),
                    find:jest.fn(),
                    update:jest.fn(),
                },

            },
            {
                provide:'REDIS_CLIENT',
                useValue:{
                    keys:jest.fn(),
                    del:jest.fn(),
                }

            },

        ],
        }).compile();
        service = module.get<UsersService>(UsersService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () =>{
        expect(service).toBeDefined();
    });
    
    it('testing of findOne',async ()=>{
        const mockUser = {id:1,email:'test@gmail.com'};
        jest.spyOn(repository,'findOne').mockResolvedValue(mockUser as User);
        const result = await service.findOne(1);
        expect(result).toEqual(mockUser);
    })
    
    it('should return null if user not found' ,async()=>{
        const mockUser = {id:1,email:'test@gmail.com'};
        jest.spyOn(repository,'findOne').mockResolvedValue(null);
        const result = await service.findOne(999);
        expect(result).toBeNull();
    })
    it('should hash password and save user', async()=>{
        const dto = {username:'Nurken',email:'nurken@gmail.com',password:'nurken12345'};
        jest.spyOn(repository,'save').mockResolvedValue({id:1,...dto,password:'hashed_password'} as any);
        const result = await service.createUser(dto);

        expect(repository.save).toHaveBeenCalledWith(
            expect.objectContaining({ password: 'hashed_password' })
        );
        
    })

});