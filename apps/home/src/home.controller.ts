/* eslint-disable prettier/prettier */
  // home.controller.ts
  import { Controller, Post, Body, Get, UseGuards, Req, Delete } from '@nestjs/common';
  import { HomeService } from './home.service';
  import { AuthenticationGuard } from 'apps/authentication/src/authentication.guard';

  @Controller('home')
  export class HomeController {
    constructor(private readonly homeService: HomeService) {}
    
    @Get('offers')
    async getTopOffers(): Promise<any[]> {
      return await this.homeService.getTopOffers();
    }
    
    @Get('products')
    async getProducts(): Promise<any[]> {
      return await this.homeService.getProducts();
    }

    @Post('products-categories')
    async getProductsCategories(@Body() body: { category: string }): Promise<any[]> {
      const { category } = body;
      return await this.homeService.getProductsByCategory(category);
    }

    @UseGuards(AuthenticationGuard)
    @Post('/add-to-favorites')
    async addToFavorites(@Req() request, @Body('productId') productId: string) {
      console.log('decodedData', request.decodedData); // Log decodedData
      const userEmail = request.decodedData.email; // Get email from decodedData
      console.log('userEmail', userEmail);
      return await this.homeService.addToFavorites(userEmail, productId);
    }

    @UseGuards(AuthenticationGuard)
    @Delete('/remove-from-favorites')
    async removeFromFavorites(@Req() request, @Body('productId') productId: string) {
      console.log('decodedData', request.decodedData); // Log decodedData
      const userEmail = request.decodedData.email; // Get email from decodedData
      console.log('userEmail', userEmail);
      return await this.homeService.removeFromFavorites(userEmail, productId);
    }

    @UseGuards(AuthenticationGuard)
    @Get('/favorites')
    async getFavorites(@Req() request): Promise<any[]> {
      console.log('decodedData', request.decodedData); // Log decodedData
      const userEmail = request.decodedData.email; // Get email from decodedData
      console.log('userEmail', userEmail);
      return await this.homeService.getFavoritesByUserEmail(userEmail);
    }

  }
