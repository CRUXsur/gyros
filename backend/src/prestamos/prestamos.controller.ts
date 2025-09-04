import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { PaginationDto } from './../common/dtos/pagination.dto';

import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { User } from '../auth/entities/user.entity'


@Controller('prestamos')
// @Auth() //centralizada toda la autenticación
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  @Post()
  @Auth()
  create(
    @Body() createPrestamoDto: CreatePrestamoDto,
    @GetUser() user: User,
  ){  
    return this.prestamosService.create(createPrestamoDto, user);
  }

  @Get()
  @Auth()
  findAll( @Query() paginationDto: PaginationDto) {
    // console.log(paginationDto);
    return this.prestamosService.findAll(paginationDto);
  }

  // @Get(':id')
  // findOne(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.prestamosService.findOne(id);
  // }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.prestamosService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth( ValidRoles.admin )
  update(
    @Param( 'id', ParseUUIDPipe ) id: string, 
    @Body() updatePrestamoDto: UpdatePrestamoDto,
    @GetUser() user: User,
  ) {
    return this.prestamosService.update(id, updatePrestamoDto, user);
  }

  @Delete(':id')
  @Auth( ValidRoles.admin )
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.prestamosService.remove(id);
  }
}
