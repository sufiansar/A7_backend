import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { AppError } from "../utils/AppError";

const validateCloudinaryConfig = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_SECRET_KEY) {
    console.warn(
      "  Cloudinary environment variables not configured. Image upload will not work."
    );
    return false;
  }
  return true;
};

const isCloudinaryConfigured = validateCloudinaryConfig();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_SECRECT_KEY as string,
});

console.log(
  process.env.CLOUDINARY_CLOUD_NAME,
  process.env.CLOUDINARY_API_KEY,
  process.env.CLOUDINARY_SECRECT_KEY
);

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  fileName: string,
  folder: string = "portfolio"
) => {
  if (!isCloudinaryConfigured) {
    throw new AppError(
      500,
      "Cloudinary is not configured",
      "CLOUDINARY_NOT_CONFIGURED"
    );
  }

  try {
    return new Promise<any>((resolve, reject) => {
      const public_id = `${folder}/${fileName}-${Date.now()}`;

      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            public_id,
            folder,
            transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });
  } catch (error: any) {
    throw new AppError(
      500,
      `Error uploading file: ${error.message}`,
      "UPLOAD_ERROR"
    );
  }
};

export const deleteImageFromCloudinary = async (url: string) => {
  if (!isCloudinaryConfigured) {
    throw new AppError(
      500,
      "Cloudinary is not configured",
      "CLOUDINARY_NOT_CONFIGURED"
    );
  }

  try {
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
    const match = url.match(regex);
    if (match && match[1]) {
      const public_id = match[1];
      const result = await cloudinary.uploader.destroy(public_id, {
        resource_type: "image",
      });
      return result;
    } else {
      throw new Error("Invalid Cloudinary URL format");
    }
  } catch (error: any) {
    throw new AppError(500, "Cloudinary image deletion failed", error.message);
  }
};

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new AppError(400, "Only image files are allowed", "INVALID_FILE_TYPE"),
      false
    );
  }
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "portfolio",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    public_id: (req: any, file: any) => {
      const fileName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9-]/g, "");

      const uniqueName = `${Math.random()
        .toString(36)
        .substring(2)}-${Date.now()}-${fileName}`;

      return uniqueName;
    },
  } as any,
});

export const MulterUpload = multer({
  storage,
  fileFilter,
});

export const cloudinaryUpload = cloudinary;

export const uploadSingle = (fieldName: string = "image") => {
  return MulterUpload.single(fieldName);
};

export const uploadMultiple = (
  fieldName: string = "images",
  maxCount: number = 5
) => {
  return MulterUpload.array(fieldName, maxCount);
};
