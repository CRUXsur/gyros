import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BancosService } from './bancos.service';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';

@Controller('bancos')
export class BancosController {
  constructor(private readonly bancosService: BancosService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.superAdmin)
  create(@Body() createBancoDto: CreateBancoDto) {
    return this.bancosService.create(createBancoDto);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.user, ValidRoles.superUser, ValidRoles.superAdmin)
  findAll() {
    return this.bancosService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.user, ValidRoles.superUser, ValidRoles.superAdmin)
  findOne(@Param('id') id: string) {
    return this.bancosService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.superAdmin)
  update(@Param('id') id: string, @Body() updateBancoDto: UpdateBancoDto) {
    return this.bancosService.update(id, updateBancoDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.superAdmin)
  remove(@Param('id') id: string) {
    return this.bancosService.remove(id);
  }
}

