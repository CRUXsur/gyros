import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';


@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.superAdmin)
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get('device/:device_id')
  @Auth(ValidRoles.admin, ValidRoles.user, ValidRoles.superUser, ValidRoles.superAdmin)
  findByDeviceId(@Param('device_id') device_id: string) {
    return this.clientesService.findByDeviceId(device_id);
  }

  @Get(':term')
  @Auth(ValidRoles.admin, ValidRoles.user, ValidRoles.superUser, ValidRoles.superAdmin)
  findOne(@Param('term') term: string) {
    return this.clientesService.findOne(term);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.superAdmin)
  findAll() {
    return this.clientesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.clientesService.findOne(id);
  // }

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.superAdmin)
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.superAdmin)
  remove(@Param('id') id: string) {
    return this.clientesService.remove(id);
  }
}
