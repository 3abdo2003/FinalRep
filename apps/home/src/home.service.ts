/* eslint-disable prettier/prettier */
  // home.service.ts
  import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Favorite } from '../interface/home.interface';
  import { Product } from 'apps/product/interfaces/product.interface';
  import { ProducerService } from '../../../libs/common/src/kafka/producer.service';
  import { HttpService } from '@nestjs/axios';
  import { lastValueFrom } from 'rxjs';
  import { AxiosResponse } from 'axios';

  @Injectable()
  export class HomeService {
    constructor(
      @InjectModel('Favorite') private readonly favoriteModel: Model<Favorite>,
      private readonly producerService: ProducerService,
      private readonly httpService: HttpService,
    ) {}

    private productServiceUrl = 'http://localhost:3003/products';  // Adjust this URL based on your Product service

    async getProducts(): Promise<Product[]> {
      const response = await lastValueFrom(this.httpService.get<AxiosResponse<any>>(this.productServiceUrl));
      return (response.data as unknown as Product[]);
    }
    
    async getProductsByCategory(category: string): Promise<Product[]> {
      if (!category) {
        throw new BadRequestException('Category parameter is required.');
      }
      const response = await lastValueFrom(this.httpService.get<AxiosResponse<any>>(`${this.productServiceUrl}/categories/${category}`));
      return (response.data as unknown as Product[]);
    }
    
    async getTopOffers(): Promise<Product[]> {
      const response = await lastValueFrom(this.httpService.get<AxiosResponse<any>>(`${this.productServiceUrl}/top-offers`));
      return (response.data as unknown as Product[]);
    }

    async addToFavorites(userEmail: string, productId: string) {
      try {
        if (!userEmail) {
          throw new BadRequestException('User email is required.');
        }
        if (!productId) {
          throw new BadRequestException('Product ID is required.');
        }
        const response = await lastValueFrom(this.httpService.get<AxiosResponse<any>>(`${this.productServiceUrl}/${productId}`));
        const product = response.data as unknown as Product;
        console.log("Product:",product);
    
        // Check if the product already exists in the user's favorites
        const existingFavorite = await this.favoriteModel.findOne({ userEmail, productId });
        if (existingFavorite) {
          throw new BadRequestException('Product is already added to favorites.');
        }
    
        const newFavorite = new this.favoriteModel({ userEmail, productId });
        return newFavorite.save();
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async removeFromFavorites(userEmail: string, productId: string) {
      try {
        if (!userEmail) {
          throw new BadRequestException('User email is required.');
        }
        if (!productId) {
          throw new BadRequestException('Product ID is required.');
        }
    
        // Find the favorite with the given userEmail and productId and remove it
        const result = await this.favoriteModel.findOneAndDelete({ userEmail, productId });
    
        if (!result) {
          throw new NotFoundException('Product not found in favorites.');
        }
    
        return { message: 'Product removed from favorites.' };
      } catch (error) {
        console.error(error);
        throw error;
      }
    }




    async getFavoritesByUserEmail(userEmail: string): Promise<Product[]> {
      if (!userEmail) {
        throw new BadRequestException('User email is required.');
      }
  
      // Find all favorite entries for the user
      const favoriteEntries = await this.favoriteModel.find({ userEmail }).exec();
      
      if (!favoriteEntries.length) {
        throw new NotFoundException('No favorite products found for this user.');
      }
  
      // Extract product IDs from the favorite entries
      const productIds = favoriteEntries.map(favorite => favorite.productId);
  
      // Fetch product details for each product ID
      const products = [];
      for (const productId of productIds) {
        const response = await lastValueFrom(this.httpService.get<AxiosResponse<any>>(`${this.productServiceUrl}/${productId}`));
        products.push(response.data as unknown as Product);
      }
  
      return products;
    }








  }

