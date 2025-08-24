import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { PaginationDto } from './../common/dtos/pagination.dto';

@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  @Post()
  create(@Body() createPrestamoDto: CreatePrestamoDto) {
    return this.prestamosService.create(createPrestamoDto);
  }

  @Get()
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
    return this.prestamosService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrestamoDto: UpdatePrestamoDto) {
    return this.prestamosService.update(+id, updatePrestamoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.prestamosService.remove(id);
  }
}
