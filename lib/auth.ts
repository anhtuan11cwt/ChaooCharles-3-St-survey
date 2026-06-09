import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "fallback-secret-change-in-production",
);
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 ngày
const COOKIE_NAME = "session_token";

// Băm mật khẩu với bcrypt (12 rounds)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// So sánh mật khẩu với hash đã lưu
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Tạo JWT + lưu session vào DB + set httpOnly cookie
export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(SESSION_SECRET);

  await prisma.session.create({
    data: {
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
      token,
      userId,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: SESSION_DURATION_MS / 1000,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return token;
}

// Xoá session khỏi DB và cookie
export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  cookieStore.delete(COOKIE_NAME);
}

// Lấy user hiện tại từ session token trong cookie
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    await jwtVerify(token, SESSION_SECRET);
    const session = await prisma.session.findUnique({
      include: { user: true },
      where: { token },
    });
    if (!session || session.expiresAt < new Date()) {
      await prisma.session.deleteMany({ where: { token } });
      return null;
    }
    return session.user;
  } catch {
    return null;
  }
}

// Redirect sang /sign-in nếu chưa đăng nhập
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}
