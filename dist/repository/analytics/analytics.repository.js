"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRepository = void 0;
const psqlDb_config_1 = require("../../configs/psqlDb.config");
const analytics_entity_1 = require("../../entities/analytics.entity");
class AnalyticsRepository {
    constructor() {
        this.repo = psqlDb_config_1.AppDataSource.getRepository(analytics_entity_1.Analytics);
    }
    async createAnalytics(dto) {
        const item = this.repo.create({ ...dto });
        return await this.repo.save(item);
    }
    async getAllAnalytics() {
        return await this.repo.find({ order: { id: "DESC" } });
    }
    async getAnalyticsById(id) {
        return await this.repo.findOne({ where: { id } });
    }
    async updateAnalytics(id, dto) {
        const item = await this.getAnalyticsById(id);
        if (!item)
            return null;
        Object.assign(item, dto);
        return await this.repo.save(item);
    }
    async deleteAnalytics(id) {
        const result = await this.repo.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}
exports.AnalyticsRepository = AnalyticsRepository;
//# sourceMappingURL=analytics.repository.js.map