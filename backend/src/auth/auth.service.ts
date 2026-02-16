import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { LoginDto } from './dtos/LoginDto.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getProfileData(userId: string) {
    const admin = await this.adminModel
      .findById(userId)
      .select(['-password', '-refreshToken']);
    if (!admin) throw new ForbiddenException('Admin not found');
    return admin;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    console.log('--- DEBUG LOGIN START ---');
    console.log('1. Attempting login for:', email);
    console.log('2. Password provided by user:', password);
    const admin = await this.adminModel.findOne({ email });
    if (!admin) {
      console.log(`Login Failed: User with email ${email} not found in DB.`);
      throw new ForbiddenException('Invalid credentials (User not found)');
    }
    console.log('3. User found:', admin._id);
    console.log('4. Stored Hash in DB:', admin.password);
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('5. bcrypt.compare result:', isMatch);
    if (!isMatch) {
      console.log('--- DEBUG LOGIN FAILED ---');
      throw new ForbiddenException('Invalid credentials');
    }
    const accessToken = await this.getAccessToken(
      admin._id.toString(),
      email,
      admin.fullName, 
      admin.profilePicture, 
    );
    const refreshToken = await this.getRefreshToken(
      admin._id.toString(),
      email,
    );
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.adminModel.findByIdAndUpdate(admin._id, {
      refreshToken: hashedRefreshToken,
    });
    return { accessToken, refreshToken };
  }

  async logout(userId: string) {
    return this.adminModel.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async getAccessToken(
    userId: string,
    email: string,
    fullName: string,
    profilePicture?: string,
  ) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        email,
        fullName, 
        profilePicture, 
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );
  }

  async getRefreshToken(userId: string, email: string) {
    return this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );
  }

  
  async refreshTokens(userId: string, rt: string) {
    const admin = await this.adminModel.findById(userId);
    if (!admin || !admin.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      rt,
      admin.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const accessToken = await this.getAccessToken(
      admin._id.toString(), 
      admin.email,
      admin.fullName,
      admin.profilePicture
    );
    const newRefreshToken = await this.getRefreshToken(
      admin._id.toString(),
      admin.email
    );
    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await this.adminModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  }

  async register(loginDto: LoginDto, fullName: string) {
    const { email, password } = loginDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new this.adminModel({
      email,
      password: hashedPassword,
      fullName,
    });

    return newAdmin.save();
  }


  async updateAdmin(
    userId: string,
    updateData: { fullName?: string; profilePicture?: string },
  ) {
    const admin = await this.adminModel
      .findByIdAndUpdate(userId, { $set: updateData }, { new: true })
      .select('-password -refreshToken');

    if (!admin) throw new ForbiddenException('Admin not found');
    return admin;
  }

  private async seedAdminUser() {
    const adminEmail = 'admin@food-eiland.com';
    const existingAdmin = await this.adminModel.findOne({ email: adminEmail });
    if (existingAdmin) {
      this.logger.log('Admin user already exists. Skipping seed.');
      return;
    }
    this.logger.log('Seeding initial Admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const newAdmin = new this.adminModel({
      email: adminEmail,
      password: hashedPassword,
      fullName: 'Super Admin',
    });
    await newAdmin.save();
    this.logger.log('Admin user created successfully!');
  }
  async onModuleInit() {
    await this.seedAdminUser();
  }
}
