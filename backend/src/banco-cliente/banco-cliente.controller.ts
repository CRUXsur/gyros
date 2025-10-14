import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BancoClienteService } from './banco-cliente.service';
import { CreateBancoClienteDto } from './dto/create-banco-cliente.dto';
import { UpdateBancoClienteDto } from './dto/update-banco-cliente.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';

@Controller('banco-cliente')
export class BancoClienteController {
  constructor(private readonly bancoClienteService: BancoClienteService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.superAdmin)
  create(@Body() createBancoClienteDto: CreateBancoClienteDto) {
    return this.bancoClienteService.create(createBancoClienteDto);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.user, ValidRoles.superUser, ValidRoles.superAdmin)
  findAll() {
    return this.bancoClienteService.findAll();
  }

  @Get('cliente/:clienteId')
  @Auth(ValidRoles.admin, ValidRoles.user, ValidRoles.superUser, ValidRoles.superAdmin)
  findByCliente(@Param('clienteId') clienteId: string) {
    return this.bancoClienteService.findByCliente(clienteId);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.user, ValidRoles.superUser, ValidRoles.superAdmin)
  findOne(@Param('id') id: string) {
    return this.bancoClienteService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.superAdmin)
  update(@Param('id') id: string, @Body() updateBancoClienteDto: UpdateBancoClienteDto) {
    return this.bancoClienteService.update(id, updateBancoClienteDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.superAdmin)
  remove(@Param('id') id: string) {
    return this.bancoClienteService.remove(id);
  }
}
