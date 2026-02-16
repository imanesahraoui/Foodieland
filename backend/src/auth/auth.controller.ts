import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/LoginDto.dto';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateAdminDto } from './dtos/UpdateAdminDto.dto';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  @Post('login')
  async login(
    @Body() authDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(authDto);
    this.setRefreshTokenCookie(res, refreshToken);
    return { accessToken };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfileData(@Req() req: Request) {
    const userId = req.user!['sub'];
    return this.authService.getProfileData(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userId = req.user!['sub'];
    await this.authService.logout(userId);

   
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: this.configService.getOrThrow('MODE') === 'PROD',
      secure: this.configService.getOrThrow('MODE') === 'PROD',
      sameSite: 'lax',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  @Post('register')
  async register(@Body() body: any) {
  // On passe le body (email, password) et le fullName séparément
  return this.authService.register(body, body.fullName);
  }


  @UseGuards(AuthGuard('jwt'))
  @Patch('update-profile')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @Req() req: any,
    @Body() updateAdminDto: UpdateAdminDto, // Utilise le nouveau DTO 
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user['sub'];
    const updateData: any = {};

    
    if (updateAdminDto.fullName) {
      updateData.fullName = updateAdminDto.fullName;
    }

    if (file) {
      const result = await this.cloudinaryService.uploadFile(file);
      updateData.profilePicture = result.url;
    }

    return this.authService.updateAdmin(userId, updateData);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
    @Get('refresh') 
    async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
      
      const userId = req.user!['sub'];
      const refreshToken = req.user!['refreshToken'];
      const tokens = await this.authService.refreshTokens(userId, refreshToken);
      this.setRefreshTokenCookie(res, tokens.refreshToken);
      return { accessToken: tokens.accessToken };
    }
}
