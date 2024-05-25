import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Patch,
  Post,
  Delete,
  Logger,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AddAddressDto } from '../dto/add-address.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { Profile, Review } from '../schema/profile.schema';
import { EditAddressByIndexDto } from '../dto/edit-address.dto';
import { DeleteAddressByIndexDto } from '../dto/delete-address.dto';
import { AddCreditCardDto } from '../dto/add-credit-card.dto';
import { EditCreditCardDto } from '../dto/edit-credit-card.dto';
import { DeleteCreditCardByIndexDto } from '../dto/delete-credit-card.dto';
import { EditReviewByIndexDto } from '../dto/edit-review.dto';
import { DeleteReviewByIndexDto } from '../dto/delete-review.dto';
import { AuthenticationGuard } from 'apps/authentication/src/authentication.guard';

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(private readonly profileService: ProfileService) {}

  // @UseGuards(AuthenticationGuard)
  @Get(':email')
  async getUserInfo(@Param('email') email: string): Promise<Profile> {
    return this.profileService.getUserInfo(email);
  }

  //@UseGuards(AuthenticationGuard)
  @Put(':email')
  async updateUser(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Profile> {
    this.logger.log(`Received update request for email: ${email}`);
    this.logger.log(`Update DTO: ${JSON.stringify(updateUserDto)}`);
    const updatedProfile = await this.profileService.updateUser(
      email,
      updateUserDto,
    );
    this.logger.log(`Updated profile: ${JSON.stringify(updatedProfile)}`);
    return updatedProfile;
  }

  //@UseGuards(AuthenticationGuard)
  @Put(':email/password')
  async updatePassword(
    @Param('email') email: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<Profile> {
    return this.profileService.updatePassword(email, updatePasswordDto);
  }

  //@UseGuards(AuthenticationGuard)
  @Patch(':email/address')
  async addAddress(
    @Param('email') email: string,
    @Body() addAddressDto: AddAddressDto,
  ): Promise<Profile> {
    return this.profileService.addAddress(email, addAddressDto);
  }

  //@UseGuards(AuthenticationGuard)
  @Patch(':email/edit-address')
  async editAddressByIndex(
    @Param('email') email: string,
    @Body() editAddressByIndexDto: EditAddressByIndexDto,
  ): Promise<Profile> {
    return this.profileService.editAddressByIndex(email, editAddressByIndexDto);
  }

  //@UseGuards(AuthenticationGuard)
  @Patch(':email/delete-address')
  async deleteAddressByIndex(
    @Param('email') email: string,
    @Body() deleteAddressByIndexDto: DeleteAddressByIndexDto,
  ): Promise<Profile> {
    return this.profileService.deleteAddressByIndex(
      email,
      deleteAddressByIndexDto,
    );
  }

  //@UseGuards(AuthenticationGuard)
  @Get(':email/addresses')
  async getAllAddresses(@Param('email') email: string): Promise<string[]> {
    return this.profileService.getAllAddresses(email);
  }

  //@UseGuards(AuthenticationGuard)
  @Post(':email/credit-card')
  async addCreditCard(
    @Param('email') email: string,
    @Body() addCreditCardDto: AddCreditCardDto,
  ): Promise<Profile> {
    return this.profileService.addCreditCard(email, addCreditCardDto);
  }

  //@UseGuards(AuthenticationGuard)
  @Patch(':email/edit-credit-card')
  async editCreditCardByIndex(
    @Param('email') email: string,
    @Body() editCreditCardDto: EditCreditCardDto,
  ): Promise<Profile> {
    return this.profileService.editCreditCardByIndex(email, editCreditCardDto);
  }

  //delete credit card by index
  @Patch(':email/delete-credit-card')
  async deleteCreditCardByIndex(
    @Param('email') email: string,
    @Body() deleteCreditCardByIndexDto: DeleteCreditCardByIndexDto,
  ): Promise<Profile> {
    return this.profileService.deleteCreditCardByIndex(
      email,
      deleteCreditCardByIndexDto,
    );
  }

  //@UseGuards(AuthenticationGuard)
  @Patch(':email/review')
  async editUserReviewByIndex(
    @Param('email') email: string,
    @Body() editReviewByIndexDto: EditReviewByIndexDto,
  ): Promise<Review> {
    try {
      return await this.profileService.editUserReviewByIndex(
        email,
        editReviewByIndexDto,
      );
    } catch (error) {
      this.logger.error(
        `Failed to edit review for user: ${email}`,
        error.stack,
      );
      throw error instanceof NotFoundException ||
        error instanceof BadRequestException
        ? error
        : new NotFoundException('Profile not found');
    }
  }

  //@UseGuards(AuthenticationGuard)
  @Patch(':email/delete-review')
  async deleteUserReviewByIndex(
    @Param('email') email: string,
    @Body() deleteReviewByIndexDto: DeleteReviewByIndexDto,
  ): Promise<void> {
    try {
      return await this.profileService.deleteUserReviewByIndex(
        email,
        deleteReviewByIndexDto,
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete review for user: ${email}`,
        error.stack,
      );
      throw error instanceof NotFoundException ||
        error instanceof BadRequestException
        ? error
        : new NotFoundException('Profile not found');
    }
  }
}
