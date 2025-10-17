"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCuotaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_cuota_dto_1 = require("./create-cuota.dto");
class UpdateCuotaDto extends (0, mapped_types_1.PartialType)(create_cuota_dto_1.CreateCuotaDto) {
}
exports.UpdateCuotaDto = UpdateCuotaDto;
//# sourceMappingURL=update-cuota.dto.js.map