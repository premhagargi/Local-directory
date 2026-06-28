import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
	region: 'auto',
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
	},
});

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File | null;
		const uid = formData.get('uid') as string;
		const folder = formData.get('folder') as string;

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 });
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const fileExt = file.name.split('.').pop() || 'jpg';
		const filename = `${uid}-${Date.now()}.${fileExt}`;
		// Use folder if provided (e.g. database name like 'listing_images')
		const key = folder ? `${folder}/${filename}` : filename;

		const command = new PutObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME,
			Key: key,
			Body: buffer,
			ContentType: file.type,
		});

		await s3Client.send(command);

		return NextResponse.json({ 
			success: true, 
			filePath: key 
		});
	} catch (error) {
		console.error('Error uploading to R2:', error);
		return NextResponse.json(
			{ error: 'Error uploading file to R2' },
			{ status: 500 }
		);
	}
}
