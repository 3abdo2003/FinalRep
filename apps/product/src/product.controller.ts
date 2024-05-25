/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Query, Headers, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO} from '../dto/product.dto';
import { AddReviewDTO } from '../dto/add-review.dto';
import { Product, ProductWithRating } from '../interfaces/product.interface';
import { HomeService } from 'apps/home/src/home.service';
import { AuthenticationGuard } from 'apps/authentication/src/authentication.guard';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly homeService: HomeService,
  ) {}

  @Post()
  async create(@Body() productDTO: ProductDTO): Promise<Product> {
    return await this.productService.create(productDTO);
  }

  @Get('top-offers')
  async findTopOffers(): Promise<Product[]> {
    return await this.productService.findTopOffers();
  }

  
  @Get('most-rated')
  async findMostRated(): Promise<Product[]> {
    return await this.productService.findMostRated();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productService.findOne(id);
  }
  
  @UseGuards(AuthenticationGuard)
  @Post('reviews')
  async addReview(@Req() request,@Body() addReviewDTO: AddReviewDTO,): Promise<Product> {
    console.log('decodedData', request.decodedData); // Log decodedData
    const userEmail = request.decodedData.email; // Get email from decodedData
    console.log('userEmail', userEmail);
    return await this.productService.addReview(userEmail, addReviewDTO); // Pass the request object to productService.addReview
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  @Get('categories/:category')
  async getProductsByCategory(@Param('category') category: string): Promise<Product[]> {
    return await this.productService.findByCategory(category);
  }

  @Get(':id/link')
  async generateProductLink(@Param('id') id: string) {
    return this.productService.generateProductLink(id);
  }


}
