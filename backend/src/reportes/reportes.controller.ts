import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('reportes')
@Auth() // Todas las rutas requieren autenticación
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Post()
  create(
    @Body() createReporteDto: CreateReporteDto,
    @GetUser() user: User,
  ) {
    return this.reportesService.create(createReporteDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.reportesService.findAll(paginationDto);
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.reportesService.findByUser(userId);
  }

  @Get(':id_reporte')
  findOne(@Param('id_reporte', ParseUUIDPipe) id_reporte: string) {
    return this.reportesService.findOne(id_reporte);
  }

  @Patch(':id_reporte')
  @Auth(ValidRoles.admin) // Solo admins pueden actualizar reportes
  update(
    @Param('id_reporte', ParseUUIDPipe) id_reporte: string, 
    @Body() updateReporteDto: UpdateReporteDto,
    @GetUser() user: User,
  ) {
    return this.reportesService.update(id_reporte, updateReporteDto, user);
  }

  @Delete(':id_reporte')
  @Auth(ValidRoles.admin) // Solo admins pueden eliminar reportes
  remove(@Param('id_reporte', ParseUUIDPipe) id_reporte: string) {
    return this.reportesService.remove(id_reporte);
  }
}

