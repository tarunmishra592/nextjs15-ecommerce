import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { generateAccessToken } from '../utils/token';
import { IUser } from '../models/User';

const SALT_ROUNDS = 10;

export async function signup(name: string, email: string, password: string): Promise<string> {
  const existing = await User.findOne({ email });
  if (existing) throw Object.assign(new Error('Email already registered'), { statusCode: 409 });

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, password: hashed });
  const token = generateAccessToken({ sub: user._id.toString() });
  return token;
}

export async function login(email: string, password: string): Promise<any> {
  const user = await User.findOne({ email });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

  const token = generateAccessToken({ sub: user._id.toString() });
  return {user, token};
}
