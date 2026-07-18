import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';
import prisma from '../lib/prisma.js';

const { SECRET_KEY } = process.env;

const sanitizeUser = (user) => ({ id: user.id, email: user.email, name: user.name });

const register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    throw HttpError(400, 'Email and password are required');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw HttpError(409, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '7d' });

  res.status(201).json({ accessToken, user: sanitizeUser(user) });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw HttpError(400, 'Email and password are required');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw HttpError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw HttpError(401, 'Invalid email or password');
  }

  const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '7d' });

  res.json({ accessToken, user: sanitizeUser(user) });
};

const getCurrentUser = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrentUser: ctrlWrapper(getCurrentUser),
};
