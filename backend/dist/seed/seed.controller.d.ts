import { SeedService } from './seed.service';
export declare class SeedController {
    private readonly seedService;
    constructor(seedService: SeedService);
    findAll(): string;
    findOne(id: string): string;
    remove(id: string): string;
}
