import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreditCard,
  Profile,
  ProfileDocument,
  Review,
} from '../schema/profile.schema';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AddAddressDto } from '../dto/add-address.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import * as bcrypt from 'bcrypt';
import { EditAddressByIndexDto } from '../dto/edit-address.dto';
import { DeleteAddressByIndexDto } from '../dto/delete-address.dto';
import { AddCreditCardDto } from '../dto/add-credit-card.dto';
import { EditCreditCardDto } from '../dto/edit-credit-card.dto';
import { DeleteCreditCardByIndexDto } from '../dto/delete-credit-card.dto';
import { AxiosResponse } from 'axios';
import { EditReviewByIndexDto } from '../dto/edit-review.dto';
import { DeleteReviewByIndexDto } from '../dto/delete-review.dto';
import { Product } from 'apps/product/interfaces/product.interface';
import { User } from 'apps/authentication/schemas/user.schema';
import { ProducerService } from '@app/common/kafka/producer.service';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectModel('Profile') private profileModel: Model<ProfileDocument>,
    private readonly httpService: HttpService,
    private readonly producerService: ProducerService,
  ) {}

  private userServiceUrl = 'http://localhost:3000/authentication/user';
  private productServiceUrl = 'http://localhost:3004/products';

  async getUserInfo(email: string): Promise<Profile> {
    let profile = await this.profileModel
      .findOne({ email })
      .select('+password')
      .exec();

    if (!profile) {
      this.logger.log(
        `Profile not found in local database, fetching from authentication service`,
      );

      const url = `${this.userServiceUrl}/${email}`;
      // const reviewsUrl = `${this.productServiceUrl}`;
      this.logger.log(`Requesting user info from URL: ${url}`);
      // this.logger.log(`Requesting user reviews from URL: ${reviewsUrl}`);

      try {
        // Fetch user info from the authentication service
        const response = await lastValueFrom(this.httpService.get<User>(url));
        const profileData = response.data;

        // Fetch all products from the product service
        // const productsResponse: AxiosResponse<Product[]> = await lastValueFrom(
        //   this.httpService.get<Product[]>(reviewsUrl),
        // );
        // const products = productsResponse.data;

        // Extract reviews made by the user
        // const reviews = products.flatMap((product) =>
        //   product.reviews
        //     .filter((review) => review.user === email)
        //     .map((review) => ({
        //       ...review,
        //       productId: product._id,
        //     })),
        // );

        // Convert address string to an array of addresses
        const addresses = profileData.address ? [profileData.address] : [];

        // Create the profile in the local database with the fetched info and reviews
        profile = new this.profileModel({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          phoneNumber: profileData.phoneNumber,
          company: profileData.company,
          addresses: addresses, // Use addresses array
          password: profileData.password,
          Token: profileData.Token,
          // reviews: reviews, // Include fetched reviews
        });

        await profile.save();
        this.logger.log(
          `Profile created in local database: ${JSON.stringify(profile)}`,
        );

        profile = await this.profileModel
          .findOne({ email })
          .select('+password')
          .exec();
      } catch (error) {
        this.logger.error(
          `Error fetching profile info or reviews: ${error.message}`,
        );
        throw new NotFoundException('Profile not found');
      }
    }

    return profile;
  }

  async updateUser(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Profile> {
    this.logger.log(
      `Updating profile info in local database for email: ${email}`,
    );
    this.logger.log(`Update data: ${JSON.stringify(updateUserDto)}`);

    const profile = await this.profileModel.findOneAndUpdate(
      { email },
      { $set: updateUserDto },
      { new: true, upsert: true },
    );

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    this.logger.log(`Profile after update: ${JSON.stringify(profile)}`);
    await this.producerService.produce({
      topic: 'profile-updated',
      messages: [{ value: JSON.stringify(profile) }],
    });

    return profile;
  }

  async updatePassword(
    email: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<Profile> {
    const { oldPassword, newPassword } = updatePasswordDto;

    const profile = await this.profileModel
      .findOne({ email })
      .select('+password')
      .exec();
    this.logger.log(
      `Retrieved profile for password update: ${JSON.stringify(profile)}`,
    );

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (!profile.password) {
      throw new NotFoundException('Password is not set for this profile');
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, profile.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    profile.password = hashedPassword;
    await profile.save();

    await this.producerService.produce({
      topic: 'new-password',
      messages: [
        { value: JSON.stringify({ email, password: hashedPassword }) },
      ],
    });

    return profile;
  }

  async addAddress(
    email: string,
    addAddressDto: AddAddressDto,
  ): Promise<Profile> {
    const { address } = addAddressDto;

    const profile = await this.profileModel.findOne({ email }).exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    profile.addresses.push(address);
    await profile.save();
    await this.producerService.produce({
      topic: 'address-added',
      messages: [{ value: JSON.stringify({ email, address }) }],
    });

    return profile;
  }

  async editAddressByIndex(
    email: string,
    editAddressByIndexDto: EditAddressByIndexDto,
  ): Promise<Profile> {
    const { index, newAddress } = editAddressByIndexDto;

    const profile = await this.profileModel.findOne({ email }).exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (index < 0 || index >= profile.addresses.length) {
      throw new BadRequestException('Invalid address index');
    }

    profile.addresses[index] = newAddress;
    await profile.save();
    await this.producerService.produce({
      topic: 'address-updated',
      messages: [{ value: JSON.stringify({ email, address: newAddress }) }],
    });

    return profile;
  }

  async deleteAddressByIndex(
    email: string,
    deleteAddressByIndexDto: DeleteAddressByIndexDto,
  ): Promise<Profile> {
    const { index } = deleteAddressByIndexDto;

    const profile = await this.profileModel.findOne({ email }).exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (index < 0 || index >= profile.addresses.length) {
      throw new BadRequestException('Invalid address index');
    }

    profile.addresses.splice(index, 1); // Remove the address at the given index
    await profile.save();
    await this.producerService.produce({
      topic: 'address-deleted',
      messages: [{ value: JSON.stringify({ email, index }) }],
    });

    return profile;
  }

  async getAllAddresses(email: string): Promise<string[]> {
    const profile = await this.profileModel.findOne({ email }).exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile.addresses;
  }

  async addCreditCard(
    email: string,
    addCreditCardDto: AddCreditCardDto,
  ): Promise<Profile> {
    const { cardNumber, cardholderName, expirationDate, cvv } =
      addCreditCardDto;

    const profile = await this.profileModel.findOne({ email }).exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const creditCard: CreditCard = {
      cardNumber,
      cardholderName,
      expirationDate,
      cvv,
    };

    profile.creditCards.push(creditCard);
    await profile.save();
    await this.producerService.produce({
      topic: 'credit-card-added',
      messages: [{ value: JSON.stringify({ email, creditCard }) }],
    });

    return profile;
  }

  async editCreditCardByIndex(
    email: string,
    editCreditCardDto: EditCreditCardDto,
  ): Promise<Profile> {
    const { index, cardNumber, cardholderName, expirationDate, cvv } =
      editCreditCardDto;

    const profile = await this.profileModel.findOne({ email }).exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (index < 0 || index >= profile.creditCards.length) {
      throw new BadRequestException('Invalid credit card index');
    }

    profile.creditCards[index] = {
      cardNumber,
      cardholderName,
      expirationDate,
      cvv,
    };

    await profile.save();
    await this.producerService.produce({
      topic: 'credit-card-updated',
      messages: [
        {
          value: JSON.stringify({
            email,
            creditCard: profile.creditCards[index],
          }),
        },
      ],
    });

    return profile;
  }

  async deleteCreditCardByIndex(
    email: string,
    deleteCreditCardByIndexDto: DeleteCreditCardByIndexDto,
  ): Promise<Profile> {
    const { index } = deleteCreditCardByIndexDto;

    const profile = await this.profileModel.findOne({ email }).exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (index < 0 || index >= profile.creditCards.length) {
      throw new BadRequestException('Invalid credit card index');
    }

    profile.creditCards.splice(index, 1); // Remove the credit card at the given index
    await profile.save();
    await this.producerService.produce({
      topic: 'credit-card-deleted',
      messages: [{ value: JSON.stringify({ email, index }) }],
    });

    return profile;
  }

  async editUserReviewByIndex(
    email: string,
    editReviewByIndexDto: EditReviewByIndexDto,
  ): Promise<Review> {
    const { index, rating, comment } = editReviewByIndexDto;

    this.logger.log(
      `Attempting to edit review for email: ${email}, index: ${index}`,
    );

    const profile = await this.profileModel.findOne({ email }).exec();
    if (!profile) {
      this.logger.warn(`Profile not found for email: ${email}`);
      throw new NotFoundException('Profile not found');
    }

    this.logger.log(`Profile found: ${JSON.stringify(profile)}`);

    if (index < 0 || index >= profile.reviews.length) {
      this.logger.warn(`Invalid review index: ${index}`);
      throw new BadRequestException('Invalid review index');
    }

    const existingReview = profile.reviews[index];
    this.logger.log(`Existing review: ${JSON.stringify(existingReview)}`);

    const updatedReview = {
      ...existingReview,
      rating,
      comment,
      createdAt: existingReview.createdAt, // Ensure createdAt remains unchanged
      productId: existingReview.productId, // Ensure productId remains unchanged
      updatedAt: new Date(), // Add updatedAt field
    };

    profile.reviews[index] = updatedReview;
    await profile.save();
    this.logger.log(`Updated review for profile: ${email}`);

    // Produce a Kafka message for the updated review
    await this.producerService.produce({
      topic: 'review-updated',
      messages: [{ value: JSON.stringify({ email, review: updatedReview }) }],
    });

    return updatedReview;
  }

  async deleteUserReviewByIndex(
    email: string,
    deleteReviewByIndexDto: DeleteReviewByIndexDto,
  ): Promise<void> {
    const { index } = deleteReviewByIndexDto;

    this.logger.log(
      `Attempting to delete review for email: ${email}, index: ${index}`,
    );

    const profile = await this.profileModel.findOne({ email }).exec();
    if (!profile) {
      this.logger.warn(`Profile not found for email: ${email}`);
      throw new NotFoundException('Profile not found');
    }

    this.logger.log(`Profile found: ${JSON.stringify(profile)}`);

    if (index < 0 || index >= profile.reviews.length) {
      this.logger.warn(`Invalid review index: ${index}`);
      throw new BadRequestException('Invalid review index');
    }

    const deletedReview = profile.reviews.splice(index, 1)[0];
    await profile.save();
    this.logger.log(`Deleted review for profile: ${email}`);

    // Produce a Kafka message for the deleted review
    await this.producerService.produce({
      topic: 'review-deleted',
      messages: [{ value: JSON.stringify({ email, review: deletedReview }) }],
    });

    this.logger.log(`Kafka message produced for deleted review`);
  }
}
