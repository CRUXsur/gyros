import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('pagos')
@Auth() // Todas las rutas requieren autenticación
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  create(
    @Body() createPagoDto: CreatePagoDto,
    @GetUser() user: User,
  ) {
    return this.pagosService.create(createPagoDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.pagosService.findAll(paginationDto);
  }

  @Get(':id_pago')
  findOne(@Param('id_pago', ParseUUIDPipe) id_pago: string) {
    return this.pagosService.findOne(id_pago);
  }

  @Get('prestamo/:id_prestamo')
  findByPrestamo(@Param('id_prestamo', ParseUUIDPipe) id_prestamo: string) {
    return this.pagosService.findByPrestamo(id_prestamo);
  }

  @Get('cuota/:id_cuota')
  findByCuota(@Param('id_cuota', ParseUUIDPipe) id_cuota: string) {
    return this.pagosService.findByCuota(id_cuota);
  }

  @Patch(':id_pago')
  @Auth(ValidRoles.admin) // Solo admins pueden actualizar pagos
  update(
    @Param('id_pago', ParseUUIDPipe) id_pago: string, 
    @Body() updatePagoDto: UpdatePagoDto,
    @GetUser() user: User,
  ) {
    return this.pagosService.update(id_pago, updatePagoDto, user);
  }

  @Delete(':id_pago')
  @Auth(ValidRoles.admin) // Solo admins pueden eliminar pagos
  remove(@Param('id_pago', ParseUUIDPipe) id_pago: string) {
    return this.pagosService.remove(id_pago);
  }
}