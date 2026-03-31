import { Analytics } from "../../entities/analytics.entity";
import { CreateAnalyticsDTO } from "../../dto/analytics/analytics.dto";
export declare class AnalyticsRepository {
    private repo;
    constructor();
    createAnalytics(dto: CreateAnalyticsDTO): Promise<Analytics>;
    getAllAnalytics(): Promise<Analytics[]>;
    getAnalyticsById(id: number): Promise<Analytics | null>;
    updateAnalytics(id: number, dto: Partial<CreateAnalyticsDTO>): Promise<Analytics | null>;
    deleteAnalytics(id: number): Promise<boolean>;
}
//# sourceMappingURL=analytics.repository.d.ts.map