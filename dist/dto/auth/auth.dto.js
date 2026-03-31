"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordDTO = exports.ForgotPasswordDTO = exports.SignInDTO = exports.SignUpDTO = void 0;
const class_validator_1 = require("class-validator");
/**
 * DTO for signing up a user
 */
class SignUpDTO {
}
exports.SignUpDTO = SignUpDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Name is required" }),
    __metadata("design:type", String)
], SignUpDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email address" }),
    __metadata("design:type", String)
], SignUpDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Password is required" }),
    (0, class_validator_1.MinLength)(6, { message: "Password must be at least 6 characters" }),
    __metadata("design:type", String)
], SignUpDTO.prototype, "password", void 0);
/**
 * DTO for signing in a user
 */
class SignInDTO {
}
exports.SignInDTO = SignInDTO;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email address" }),
    __metadata("design:type", String)
], SignInDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Password is required" }),
    __metadata("design:type", String)
], SignInDTO.prototype, "password", void 0);
/**
 * DTO for forgot password
 */
class ForgotPasswordDTO {
}
exports.ForgotPasswordDTO = ForgotPasswordDTO;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email address" }),
    __metadata("design:type", String)
], ForgotPasswordDTO.prototype, "email", void 0);
/**
 * DTO for reset password
 */
class ResetPasswordDTO {
}
exports.ResetPasswordDTO = ResetPasswordDTO;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email address" }),
    __metadata("design:type", String)
], ResetPasswordDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Reset token is required" }),
    __metadata("design:type", String)
], ResetPasswordDTO.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Password is required" }),
    (0, class_validator_1.MinLength)(6, { message: "Password must be at least 6 characters" }),
    __metadata("design:type", String)
], ResetPasswordDTO.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Confirm password is required" }),
    (0, class_validator_1.MinLength)(6, { message: "Confirm password must be at least 6 characters" }),
    __metadata("design:type", String)
], ResetPasswordDTO.prototype, "confirmPassword", void 0);
//# sourceMappingURL=auth.dto.js.map