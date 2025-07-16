import {Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {CreateUserDto} from './dto/create-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import {InvalidUserCredentialsException, UserAlreadyExistsException, UserNotFoundException} from "./exceptions";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw UserNotFoundException.byId(id);
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw UserNotFoundException.byEmail(email);
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { name: username } });

    if (!user) {
      throw UserNotFoundException.byUsername(username);
    }

    return user;
  }

  // ===== CREATE USER EXAMPLES =====
  async createUser(createUserDto: CreateUserDto): Promise<{
    success: boolean;
    message: string;
  }> {
    // Check for existing email
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });

    if (existingUserByEmail) {
      throw UserAlreadyExistsException.withEmail(createUserDto.email, existingUserByEmail.id);
    }

    // Check for existing username if provided
    if (createUserDto.name) {
      const existingUserByUsername = await this.userRepository.findOne({
        where: { name: createUserDto.name }
      });

      if (existingUserByUsername) {
        throw UserAlreadyExistsException.withUsername(createUserDto.name, existingUserByUsername.id);
      }
    }

    // Check for existing phone if provided
    if (createUserDto.phone) {
      const existingUserByPhone = await this.userRepository.findOne({
        where: { phone: createUserDto.phone }
      });

      if (existingUserByPhone) {
        throw UserAlreadyExistsException.withPhone(createUserDto.phone, existingUserByPhone.id);
      }
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword
    });

    return {
      success: true,
      message: "OTP sent to email. Please verify your account"
    };
  }

  // ===== UPDATE USER EXAMPLES =====
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // First check if user exists
    const user = await this.findById(id); // Will throw UserNotFoundException if not found

    // Check for email conflicts if email is being updated
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email }
      });

      if (existingUser) {
        throw UserAlreadyExistsException.withEmail(updateUserDto.email, existingUser.id);
      }
    }

    // Check for username conflicts if username is being updated
    if (updateUserDto.username && updateUserDto.username !== user.name) {
      const existingUser = await this.userRepository.findOne({
        where: { name: updateUserDto.username }
      });

      if (existingUser) {
        throw UserAlreadyExistsException.withUsername(updateUserDto.username, existingUser.id);
      }
    }

    // Update and save
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  // ===== AUTHENTICATION EXAMPLES =====
  async validateUserCredentials(email: string, password: string): Promise<User> {
    let user: User;

    try {
      user = await this.findByEmail(email);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        // Don't reveal that user doesn't exist for security
        throw InvalidUserCredentialsException.userNotFound('email');
      }
      throw error;
    }

    // Check if account is disabled
    if (!user.isActive) {
      throw InvalidUserCredentialsException.accountDisabled(
          'email',
          'Account has been deactivated'
      );
    }

    // Check if account is locked
    if (user.isLocked && user.lockoutExpiry && user.lockoutExpiry > new Date()) {
      throw InvalidUserCredentialsException.accountLocked(
          'email',
          user.lockoutExpiry,
          user.failedLoginAttempts
      );
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Increment failed attempts
      await this.handleFailedLogin(user);

      throw InvalidUserCredentialsException.invalidPassword(
          'email',
          user.failedLoginAttempts + 1
      );
    }

    // Reset failed attempts on successful login
    if (user.failedLoginAttempts > 0) {
      await this.resetFailedLoginAttempts(user);
    }

    return user;
  }

  private async handleFailedLogin(user: User): Promise<void> {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

    // Lock account after 5 failed attempts
    if (user.failedLoginAttempts >= 5) {
      user.isLocked = true;
      user.lockoutExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    }

    await this.userRepository.save(user);
  }

  private async resetFailedLoginAttempts(user: User): Promise<void> {
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockoutExpiry = null;
    await this.userRepository.save(user);
  }

  // ===== DELETE USER EXAMPLES =====
  async deleteUser(id: number): Promise<void> {
    const user = await this.findById(id); // Will throw UserNotFoundException if not found
    await this.userRepository.remove(user);
  }

  async softDeleteUser(id: number): Promise<User> {
    const user = await this.findById(id); // Will throw UserNotFoundException if not found
    user.isActive = false;
    user.deletedAt = new Date();
    return await this.userRepository.save(user);
  }
}
