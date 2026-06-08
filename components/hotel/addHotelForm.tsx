"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

	function onSubmit(values: HotelFormValues) {
		console.log(values);
	}

	return (
		<div>
			<h2 className="mb-4 text-2xl font-bold">
				{hotel ? "Cập nhật khách sạn" : "Tạo khách sạn mới"}
			</h2>
			<Form
				className="space-y-7"
				form={form}
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tiêu đề</FormLabel>
							<FormControl>
								<Input placeholder="Nhập tên khách sạn" {...field} />
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
							<FormLabel>Mô tả</FormLabel>
							<FormControl>
								<Textarea placeholder="Nhập mô tả khách sạn" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="image"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Link hình ảnh</FormLabel>
							<FormControl>
								<Input placeholder="Nhập link hình ảnh" {...field} />
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
									<Input placeholder="Nhập tỉnh/thành" {...field} />
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
									<Input placeholder="Nhập quận/huyện" {...field} />
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
							<FormControl>
								<Textarea placeholder="Nhập mô tả vị trí" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div>
					<h3 className="mb-3 text-lg font-medium">Tiện ích</h3>
					<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
						{amenities.map((amenity) => (
							<FormField
								control={form.control}
								key={amenity.name}
								name={amenity.name}
								render={({ field }) => (
									<FormItem className="flex flex-row items-center gap-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value as boolean}
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
				<Button className="w-full" type="submit">
					{hotel ? "Cập nhật" : "Tạo mới"}
				</Button>
			</Form>
		</div>
	);
}
