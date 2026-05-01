const prisma = require('../../config/database');
const { hashPassword, comparePassword } = require('../../utils/bcrypt');
const { generateToken } = require('../../utils/jwt');

class AuthService {
    async register(data) {
        const { username, password, role, nama, email, npm } = data;

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role,
                ...(role === 'PESERTA'
                    ? {
                        peserta: {
                            create: {
                                npm,
                                nama,
                                email,
                            },
                        },
                    }
                    : {
                        sekretaris: {
                            create: {
                                nama,
                                npm,
                            },
                        },
                    }),
            },
            include: {
                peserta: true,
                sekretaris: true,
            },
        });

        delete user.password;

        return user;
    }

    async login(username, password) {
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                peserta: true,
                sekretaris: true,
            },
        });

        if (!user) {
            throw new Error('Username atau password salah');
        }

        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
            throw new Error('Username atau password salah');
        }

        const token = generateToken({
            userId: user.id,
            role: user.role,
            pesertaId: user.peserta?.id,
            sekretarisId: user.sekretaris?.id,
        });

        delete user.password;

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                firstLogin: user.peserta?.firstLogin || false,
                profile: user.peserta || user.sekretaris,
            },
        };
    }
}

module.exports = new AuthService();