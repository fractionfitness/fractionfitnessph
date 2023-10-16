import 'server-only';

import { hash } from 'bcrypt';

import { HASH_SALT } from '@/config';

export async function hashPassword(password) {
  return hash(password, HASH_SALT);
}
