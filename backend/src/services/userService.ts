import { User } from '../models/User';
import { Address } from '../models/Address';
import bcrypt from 'bcrypt';

export async function getUserById(userId: string) {
  const user = await User.findById(userId).populate('addresses').select('-password');
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  return user;
}

export async function updateProfile(userId: string, updates: { name?: string; email?: string }) {
  const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  return user;
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw Object.assign(new Error('Current password incorrect'), { statusCode: 400 });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return true;
}

export async function addAddress(userId: string, addressData: any) {
  const address = await Address.create({ ...addressData, user: userId });
  await User.findByIdAndUpdate(userId, { $push: { addresses: address._id } });
  return address;
}

export async function listAddresses(userId: string) {
  const user = await User.findById(userId).populate('addresses');
  return user?.addresses ?? [];
}
