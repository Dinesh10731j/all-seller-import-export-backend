import { User } from "../../entities/user.entity";
export declare class AuthRepository {
    private repo;
    constructor();
    createUser(userData: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    saveUser(user: User): Promise<User>;
}
//# sourceMappingURL=auth.repository.d.ts.map