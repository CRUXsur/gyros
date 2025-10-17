import { BancosService } from '../bancos/bancos.service';
export declare class SeedService {
    private readonly bancosService;
    constructor(bancosService: BancosService);
    seedBancos(): Promise<{
        ok: boolean;
        message: string;
        count: any;
    }>;
    findAll(): string;
    findOne(id: number): string;
    remove(id: number): string;
}
