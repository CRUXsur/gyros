import { SeedService } from './seed.service';
export declare class SeedController {
    private readonly seedService;
    constructor(seedService: SeedService);
    seedBancos(): Promise<{
        ok: boolean;
        message: string;
        count: any;
    }>;
    findAll(): string;
    findOne(id: string): string;
    remove(id: string): string;
}
