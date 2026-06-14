import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import * as userRepo from '../repositories/user.repository.js';

const SALT_ROUNDS = 12;

function assertEmail(email) {
  const e = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
    const err = new Error('E-mail inválido.');
    err.status = 400;
    throw err;
  }
  return e;
}

function assertPassword(password) {
  if (!password || String(password).length < 8) {
    const err = new Error('A senha deve ter no mínimo 8 caracteres.');
    err.status = 400;
    throw err;
  }
}

export async function register({ email, password, fullName }) {
  const e = assertEmail(email);
  assertPassword(password);
  const name = String(fullName || '').trim();
  if (name.length < 2) {
    const err = new Error('Informe o nome com pelo menos 2 caracteres.');
    err.status = 400;
    throw err;
  }
  const existing = await userRepo.findUserByEmail(e);
  if (existing) {
    const err = new Error('E-mail já cadastrado.');
    err.status = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS);
  const user = await userRepo.createUser({
    email: e,
    passwordHash,
    fullName: name,
  });
  const token = signToken(user);
  return { user: toPublicUser(user), token };
}

export async function login({ email, password }) {
  const e = assertEmail(email);
  assertPassword(password);
  const user = await userRepo.findUserByEmail(e);
  if (!user) {
    const err = new Error('Credenciais inválidas.');
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(String(password), user.password_hash);
  if (!ok) {
    const err = new Error('Credenciais inválidas.');
    err.status = 401;
    throw err;
  }
  const token = signToken(user);
  return { user: toPublicUser(user), token };
}

export async function getMe(userId) {
  const user = await userRepo.findUserById(userId);
  if (!user) {
    const err = new Error('Usuário não encontrado.');
    err.status = 404;
    throw err;
  }
  return toPublicUser(user);
}

function toPublicUser(row) {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    createdAt: row.created_at,
  };
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}
