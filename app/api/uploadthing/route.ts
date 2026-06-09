import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Route handler cho UploadThing — GET để render form, POST để upload
export const { GET, POST } = createRouteHandler({ router: ourFileRouter });
