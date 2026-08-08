import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary if credentials are present
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'dummy_cloud_name';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn('Cloudinary credentials missing or default. Uploads will fall back to local disk.');
}

/**
 * Upload a file to Cloudinary or save locally.
 * @param {Object} file - Multer file object
 * @param {string} folder - Folder/category name
 * @returns {Promise<string>} - Public URL of the uploaded image
 */
export const uploadImage = async (file, folder = 'portfolio') => {
  if (!file) throw new Error('No file provided for upload');

  if (isCloudinaryConfigured) {
    try {
      // Create a promise to handle stream upload
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `madanraj_portfolio/${folder}`,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );
        uploadStream.end(file.buffer);
      });
    } catch (error) {
      console.error('Cloudinary upload failed, trying local fallback:', error.message);
    }
  }

  // Local disk fallback
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileExtension = path.extname(file.originalname);
  const uniqueFilename = `${folder}-${Date.now()}${fileExtension}`;
  const filePath = path.join(uploadsDir, uniqueFilename);

  fs.writeFileSync(filePath, file.buffer);
  
  // Return URL matching local server static route
  const serverUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace('5173', '5000') : 'http://localhost:5000';
  return `${serverUrl}/uploads/${uniqueFilename}`;
};

/**
 * Delete image from Cloudinary or local disk.
 * @param {string} fileUrl - Full URL of the image
 */
export const deleteImage = async (fileUrl) => {
  if (!fileUrl) return;

  if (fileUrl.includes('res.cloudinary.com') && isCloudinaryConfigured) {
    try {
      // Extract public_id from Cloudinary URL
      const urlParts = fileUrl.split('/');
      const publicIdWithFormat = urlParts.slice(urlParts.indexOf('madanraj_portfolio')).join('/');
      const publicId = publicIdWithFormat.substring(0, publicIdWithFormat.lastIndexOf('.'));
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted image from Cloudinary: ${publicId}`);
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error.message);
    }
  } else if (fileUrl.includes('/uploads/')) {
    try {
      const filename = fileUrl.split('/uploads/')[1];
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted local file: ${filename}`);
      }
    } catch (error) {
      console.error('Failed to delete local file:', error.message);
    }
  }
};
