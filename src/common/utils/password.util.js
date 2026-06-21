import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordUtil {
  async hash(password) {
    return bcrypt.hash(password, 12);
  }

  async compare(plain, hash) {
    return bcrypt.compare(plain, hash);
  }
}
