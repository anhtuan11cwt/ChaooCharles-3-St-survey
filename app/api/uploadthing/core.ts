import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getCurrentUser } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
	imageUploader: f({
		image: { maxFileCount: 1, maxFileSize: "4MB" },
	})
		.middleware(async () => {
			const user = await getCurrentUser();
			if (!user) throw new UploadThingError("Không được phép");
			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Tải lên hoàn tất cho người dùng:", metadata.userId);
			console.log("URL tập tin:", file.ufsUrl);
			return { uploadedBy: metadata.userId, url: file.ufsUrl };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
