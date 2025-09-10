import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CuotasService } from './cuotas.service';
import { CreateCuotaDto } from './dto/create-cuota.dto';
import { UpdateCuotaDto } from './dto/update-cuota.dto';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('cuotas')
@Auth() // Todas las rutas requieren autenticación
export class CuotasController {
  constructor(private readonly cuotasService: CuotasService) {}

  @Post()
  create(
    @Body() createCuotaDto: CreateCuotaDto,
    @GetUser() user: User,
  ) {
    return this.cuotasService.create(createCuotaDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.cuotasService.findAll(paginationDto);
  }

  @Get(':id_cuota')
  findOne(@Param('id_cuota', ParseUUIDPipe) id_cuota: string) {
    return this.cuotasService.findOne(id_cuota);
  }

  @Get('prestamo/:id_prestamo')
  findByPrestamo(@Param('id_prestamo', ParseUUIDPipe) id_prestamo: string) {
    return this.cuotasService.findByPrestamo(id_prestamo);
  }

  @Patch(':id_cuota')
  @Auth(ValidRoles.admin) // Solo admins pueden actualizar cuotas
  update(
    @Param('id_cuota', ParseUUIDPipe) id_cuota: string, 
    @Body() updateCuotaDto: UpdateCuotaDto,
    @GetUser() user: User,
  ) {
    return this.cuotasService.update(id_cuota, updateCuotaDto, user);
  }

  @Delete(':id_cuota')
  @Auth(ValidRoles.admin) // Solo admins pueden eliminar cuotas
  remove(@Param('id_cuota', ParseUUIDPipe) id_cuota: string) {
    return this.cuotasService.remove(id_cuota);
  }
}