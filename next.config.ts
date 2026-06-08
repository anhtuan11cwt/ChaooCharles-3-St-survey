import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "utfs.io",
				pathname: "/**",
				protocol: "https",
			},
		],
	},
};

export default nextConfig;
