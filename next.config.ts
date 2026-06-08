import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "utfs.io",
				pathname: "/**",
				protocol: "https",
			},
			{
				hostname: "*.ufs.sh",
				pathname: "/**",
				protocol: "https",
			},
		],
	},
};

export default nextConfig;
