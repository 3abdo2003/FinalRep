/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../interfaces/product.interface';
import { ProductDTO } from '../dto/product.dto';
import { AddReviewDTO } from '../dto/add-review.dto';
import { ProducerService } from '../../../libs/common/src/kafka/producer.service'; // Adjust the path as per your project structure
import { AuthenticationService } from 'apps/authentication/src/authentication.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private readonly producerService: ProducerService, // Inject the ProducerService
    private readonly authenticationService: AuthenticationService,
  ) {}

  async create(productDTO: ProductDTO): Promise<Product> {
    const { price, discount } = productDTO;
    
    // Calculate discounted price and percentage off
    let discountedPrice: number;
    let percentageOff: number;

    if (discount && discount > 0) {
        discountedPrice = price - (price * discount) / 100;
        percentageOff = discount;
    } else {
        discountedPrice = price;
        percentageOff = 0;
    }

    const createdProduct = new this.productModel({
        ...productDTO,
        discountedPrice,
        percentageOff,
        topOffer: discount && discount > 0 // Set topOffer based on discount
    });

    const savedProduct = await createdProduct.save();
    
    // Produce a Kafka message for product creation
    await this.producerService.produce({
        topic: 'product-created',
        messages: [{ value: JSON.stringify(savedProduct) }],
    });

    return savedProduct;
  }

  async findAll(): Promise<Product[]> {
    return await this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    return await this.productModel.findById(id).exec();
  }

  async addReview(userEmail: string, addReviewDTO: AddReviewDTO): Promise<Product> {
    try {    
      if (!userEmail) {
        throw new BadRequestException('User email is required.');
      }
      if (!addReviewDTO.id) {
        throw new BadRequestException('Product ID is required.');
      }

      // Find product by ID
      const product = await this.productModel.findById(addReviewDTO.id).exec();
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Create review
      const review = {
        user: userEmail, // Using user's email for the review
        rating: addReviewDTO.rating,
        comment: addReviewDTO.comment,
        createdAt: new Date(),
      };

      // Add review to product
      product.reviews.push(review);

      // Save product
      const savedProduct = await product.save();

      // Produce a Kafka message for adding a review to the product
      await this.producerService.produce({
        topic: 'product-updated', // Assuming adding a review is considered an update
        messages: [{ value: JSON.stringify(savedProduct) }],
      });

      return savedProduct;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findTopOffers(): Promise<Product[]> {
    const topOfferProducts = await this.productModel.find({ discount: { $exists: true, $ne: null, $gt: 0 } }).exec();
    for (const product of topOfferProducts) {
      product.topOffer = true; // Set topOffer as true
      await product.save();
    }
    return topOfferProducts;
  }

  async findByCategory(category: string): Promise<Product[]> {
    return await this.productModel.find({ category }).exec();
  }

  async findMostRated(): Promise<Product[]> {
    const result = await this.productModel.aggregate([
      {
        $addFields: {
          reviewCount: {
            $size: { $ifNull: ["$reviews", []] } // Handle missing or null reviews
          }
        }
      },
      {
        $group: {
          _id: null,
          maxReviewCount: { $max: "$reviewCount" }
        }
      }
    ]).exec();
  
    const maxReviewCount = result[0]?.maxReviewCount || 0;
  
    return await this.productModel.find({
      reviews: { $size: maxReviewCount }
    }).exec();
  }

  async generateProductLink(id: string): Promise<string> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  
    // Assuming your application is hosted at 'www.yourwebsite.com'
    const productLink = `localhost:4000/products/${id}`;
  
    return productLink;
  }
  
}
