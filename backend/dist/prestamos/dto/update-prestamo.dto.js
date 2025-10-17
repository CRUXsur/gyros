"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePrestamoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_prestamo_dto_1 = require("./create-prestamo.dto");
class UpdatePrestamoDto extends (0, mapped_types_1.PartialType)(create_prestamo_dto_1.CreatePrestamoDto) {
}
exports.UpdatePrestamoDto = UpdatePrestamoDto;
//# sourceMappingURL=update-prestamo.dto.js.map