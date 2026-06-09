import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Button upload ảnh dùng UploadThing
export const UploadButton = generateUploadButton<OurFileRouter>();
