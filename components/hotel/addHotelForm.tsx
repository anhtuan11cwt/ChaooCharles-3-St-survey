"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useLocation, { type District, type Province } from "@/hooks/useLocation";
import type { Hotel, Room } from "@/lib/generated/prisma/client";

export type HotelWithRooms = Hotel & { rooms: Room[] };

interface AddHotelFormProps {
	hotel: HotelWithRooms | null;
}

const formSchema = z.object({
	bar: z.boolean().optional(),
	bikeRental: z.boolean().optional(),
	city: z.string().optional(),
	coffeeShop: z.boolean().optional(),
	description: z
		.string()
		.min(10, { message: "Mô tả phải có ít nhất 10 ký tự" }),
	freeParking: z.boolean().optional(),
	freeWifi: z.boolean().optional(),
	gym: z.boolean().optional(),
	image: z.string().min(1, { message: "Hình ảnh là bắt buộc" }),
	laundry: z.boolean().optional(),
	locationDescription: z
		.string()
		.min(10, { message: "Mô tả vị trí phải có ít nhất 10 ký tự" }),
	movieNight: z.boolean().optional(),
	restaurant: z.boolean().optional(),
	shopping: z.boolean().optional(),
	spa: z.boolean().optional(),
	state: z.string().optional(),
	swimmingPool: z.boolean().optional(),
	title: z.string().min(3, { message: "Tiêu đề phải có ít nhất 3 ký tự" }),
});

type HotelFormValues = z.infer<typeof formSchema>;

const defaultValues: HotelFormValues = {
	bar: false,
	bikeRental: false,
	city: "",
	coffeeShop: false,
	description: "",
	freeParking: false,
	freeWifi: false,
	gym: false,
	image: "",
	laundry: false,
	locationDescription: "",
	movieNight: false,
	restaurant: false,
	shopping: false,
	spa: false,
	state: "",
	swimmingPool: false,
	title: "",
};

const amenities = [
	{ label: "Phòng tập gym", name: "gym" },
	{ label: "Spa", name: "spa" },
	{ label: "Quầy bar", name: "bar" },
	{ label: "Giặt ủi", name: "laundry" },
	{ label: "Nhà hàng", name: "restaurant" },
	{ label: "Mua sắm", name: "shopping" },
	{ label: "Đỗ xe miễn phí", name: "freeParking" },
	{ label: "Thuê xe đạp", name: "bikeRental" },
	{ label: "Wifi miễn phí", name: "freeWifi" },
	{ label: "Đêm phim", name: "movieNight" },
	{ label: "Hồ bơi", name: "swimmingPool" },
	{ label: "Quán cà phê", name: "coffeeShop" },
] as const;

export default function AddHotelForm({ hotel }: AddHotelFormProps) {
	const selectedFileRef = useRef<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string>("");
	const { fetchAllProvinces, fetchDistrictsByProvinceId } = useLocation();
	const [provinces, setProvinces] = useState<Province[]>([]);
	const [districts, setDistricts] = useState<District[]>([]);

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}

			selectedFileRef.current = file;
			setPreviewUrl(URL.createObjectURL(file));
		},
		[previewUrl],
	);

	const handleRemoveImage = useCallback(() => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		selectedFileRef.current = null;
		setPreviewUrl("");
	}, [previewUrl]);

	const form = useForm<HotelFormValues>({
		defaultValues: hotel
			? {
					bar: hotel.bar,
					bikeRental: hotel.bikeRental,
					city: hotel.city,
					coffeeShop: hotel.coffeeShop,
					description: hotel.description,
					freeParking: hotel.freeParking,
					freeWifi: hotel.freeWifi,
					gym: hotel.gym,
					image: hotel.image,
					laundry: hotel.laundry,
					locationDescription: hotel.locationDescription,
					movieNight: hotel.movieNight,
					restaurant: hotel.restaurant,
					shopping: hotel.shopping,
					spa: hotel.spa,
					state: hotel.state,
					swimmingPool: hotel.swimmingPool,
					title: hotel.title,
				}
			: defaultValues,
		resolver: zodResolver(formSchema),
	});

	const selectedProvince = useWatch({ control: form.control, name: "state" });
	const [, startTransition] = useTransition();

	useEffect(() => {
		fetchAllProvinces().then(setProvinces);
	}, [fetchAllProvinces]);

	useEffect(() => {
		if (selectedProvince) {
			fetchDistrictsByProvinceId(selectedProvince).then((data) => {
				startTransition(() => setDistricts(data));
			});
		} else {
			startTransition(() => setDistricts([]));
		}
	}, [selectedProvince, fetchDistrictsByProvinceId]);

	function onSubmit(values: HotelFormValues) {
		console.log(values);
	}

	return (
		<Form
			className="space-y-7"
			form={form}
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<h3 className="text-lg font-semibold">
				{hotel ? "Cập nhật khách sạn" : "Mô tả khách sạn"}
			</h3>
			<div className="mt-6 flex flex-col gap-6 md:flex-row">
				<div className="flex flex-1 flex-col gap-6">
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tiêu đề khách sạn</FormLabel>
								<FormDescription>Nhập tên khách sạn của bạn</FormDescription>
								<FormControl>
									<Input placeholder="Khách sạn Biển" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Mô tả khách sạn</FormLabel>
								<FormDescription>
									Cung cấp mô tả chi tiết về khách sạn của bạn
								</FormDescription>
								<FormControl>
									<Textarea placeholder="Mô tả khách sạn..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="image"
						render={() => (
							<FormItem>
								<FormLabel>
									Hình ảnh khách sạn <span className="text-destructive">*</span>
								</FormLabel>
								<FormDescription>
									Chọn ảnh JPG hoặc PNG, tối đa 4MB
								</FormDescription>
								<FormControl>
									{previewUrl ? (
										<div className="relative">
											<Image
												alt="Xem trước"
												className="h-auto w-full rounded-lg border border-border object-contain"
												height={0}
												sizes="100vw"
												src={previewUrl}
												width={0}
											/>
											<Button
												className="absolute -right-2 -top-2 h-7 w-7 rounded-full"
												onClick={handleRemoveImage}
												size="icon"
												type="button"
												variant="destructive"
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									) : (
										<label
											className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary/50"
											htmlFor="hotel-image-upload"
										>
											<ImageIcon className="h-10 w-10 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">
												Nhấn để chọn ảnh
											</span>
											<Input
												accept="image/*"
												className="hidden"
												id="hotel-image-upload"
												onChange={handleFileChange}
												type="file"
											/>
										</label>
									)}
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="state"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tỉnh/Thành phố</FormLabel>
									<FormControl>
										<Select
											disabled={provinces.length < 1}
											onValueChange={field.onChange}
											value={field.value}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Chọn tỉnh/thành phố" />
											</SelectTrigger>
											<SelectContent>
												{provinces.map((province) => (
													<SelectItem
														key={province.idProvince}
														value={province.idProvince}
													>
														{province.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="city"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Quận/Huyện</FormLabel>
									<FormControl>
										<Select
											disabled={districts.length < 1}
											onValueChange={field.onChange}
											value={field.value}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Chọn quận/huyện" />
											</SelectTrigger>
											<SelectContent>
												{districts.map((district) => (
													<SelectItem
														key={district.idDistrict}
														value={district.idDistrict}
													>
														{district.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="locationDescription"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Mô tả vị trí</FormLabel>
								<FormDescription>Mô tả vị trí của khách sạn</FormDescription>
								<FormControl>
									<Textarea placeholder="Mô tả vị trí..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex flex-1 flex-col gap-6">
					<div>
						<FormLabel>Chọn tiện ích</FormLabel>
						<FormDescription>
							Chọn các tiện ích có sẵn tại khách sạn
						</FormDescription>
						<div className="mt-2 grid grid-cols-2 gap-4">
							{amenities.map((amenity) => (
								<FormField
									control={form.control}
									key={amenity.name}
									name={amenity.name}
									render={({ field }) => (
										<FormItem className="flex flex-row items-center space-x-3 rounded-md border p-4">
											<FormControl>
												<Checkbox
													checked={field.value as boolean}
													className="mt-0.5"
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<FormLabel className="font-normal">
												{amenity.label}
											</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
			<Button className="mt-6 w-full" type="submit">
				{hotel ? "Cập nhật" : "Tạo mới"}
			</Button>
		</Form>
	);
}
