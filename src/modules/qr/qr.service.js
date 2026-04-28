const crypto = require('crypto');
const QRCode = require('qrcode');
const prisma = require('../../config/database');

class QRService {
    async generateQRToken(sekretarisId) {
        const token = crypto.randomBytes(32).toString('hex');

        const expiresMinutes = parseInt(process.env.QR_TOKEN_EXPIRES_MINUTES) || 5;
        const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);

        const qrToken = await prisma.qRToken.create({
            data: {
                token,
                expiresAt,
                sekretarisId,
            },
        });

        const qrCodeData = JSON.stringify({
            token: qrToken.token,
            timestamp: Date.now(),
        });

        const qrCodeImage = await QRCode.toDataURL(qrCodeData);

        return {
            token: qrToken.token,
            expiresAt: qrToken.expiresAt,
            qrCodeImage, // Base64 img str y
        };
    }

    async validateQRToken(token) {
        const qrToken = await prisma.qRToken.findUnique({
            where: { token },
        });

        if (!qrToken) {
            throw new Error('QR Code tidak valid');
        }

        if (qrToken.isUsed) {
            throw new Error('QR Code sudah digunakan');
        }

        if (new Date() > qrToken.expiresAt) {
            throw new Error('QR Code sudah kadaluarsa');
        }

        return qrToken;
    }

    async markAsUsed(tokenId) {
        await prisma.qRToken.update({
            where: { id: tokenId },
            data: { isUsed: true },
        });
    }
}

module.exports = new QRService();