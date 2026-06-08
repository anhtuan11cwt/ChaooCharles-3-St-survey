"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

import axios from "axios";
import { ImageIcon, Loader2, Plus, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import type { HotelWithRooms } from "@/components/hotel/addHotelForm";
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
import { Textarea } from "@/components/ui/textarea";
import type { Room } from "@/lib/generated/prisma/client";

interface AddRoomFormProps {
  handleDialogOpen: () => void;
  hotel?: HotelWithRooms;
  room?: Room;
}

const formSchema = z.object({
  balcony: z.boolean().optional(),
  bathroomCount: z
    .number()
    .min(1, { message: "Số lượng phòng tắm phải lớn hơn 0" }),
  bedCount: z.number().min(1, { message: "Số lượng giường phải lớn hơn 0" }),
  breakfastPrice: z.number().optional(),
  cityView: z.boolean().optional(),
  description: z
    .string()
    .min(10, { message: "Mô tả phải có ít nhất 10 ký tự" }),
  forestView: z.boolean().optional(),
  guestCount: z.number().min(1, { message: "Số lượng khách phải lớn hơn 0" }),
  image: z.string().min(1, { message: "Vui lòng chọn ảnh phòng" }),
  kingBed: z.number().min(0).optional(),
  mountainView: z.boolean().optional(),
  oceanView: z.boolean().optional(),
  queenBed: z.number().min(0).optional(),
  roomPrice: z.number().min(1, { message: "Giá phòng phải lớn hơn 0" }),
  roomService: z.boolean().optional(),
  soundProofed: z.boolean().optional(),
  title: z.string().min(3, { message: "Tiêu đề phải có ít nhất 3 ký tự" }),
  tv: z.boolean().optional(),
});

type RoomFormValues = z.infer<typeof formSchema>;

const defaultValues: RoomFormValues = {
  balcony: false,
  bathroomCount: 0,
  bedCount: 0,
  breakfastPrice: 0,
  cityView: false,
  description: "",
  forestView: false,
  guestCount: 0,
  image: "",
  kingBed: 0,
  mountainView: false,
  oceanView: false,
  queenBed: 0,
  roomPrice: 0,
  roomService: false,
  soundProofed: false,
  title: "",
  tv: false,
};

const amenities = [
  { label: "Dịch vụ phòng", name: "roomService" },
  { label: "TV", name: "tv" },
  { label: "Ban công", name: "balcony" },
  { label: "View thành phố", name: "cityView" },
  { label: "View biển", name: "oceanView" },
  { label: "View rừng", name: "forestView" },
  { label: "View núi", name: "mountainView" },
  { label: "Cách âm", name: "soundProofed" },
] as const;

export default function AddRoomForm({
  hotel,
  room,
  handleDialogOpen,
}: AddRoomFormProps) {
  const selectedFileRef = useRef<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(room?.image ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const { startUpload } = useUploadThing("imageUploader", {
    onUploadError: (error) => {
      toast.error(`Lỗi tải ảnh: ${error.message}`);
    },
  });

  const form = useForm<RoomFormValues>({
    defaultValues: room
      ? {
          balcony: room.balcony,
          bathroomCount: room.bathroomCount,
          bedCount: room.bedCount,
          breakfastPrice: room.breakfastPrice,
          cityView: room.cityView,
          description: room.description,
          forestView: room.forestView,
          guestCount: room.guestCount,
          image: room.image,
          kingBed: room.kingBed,
          mountainView: room.mountainView,
          oceanView: room.oceanView,
          queenBed: room.queenBed,
          roomPrice: room.roomPrice,
          roomService: room.roomService,
          soundProofed: room.soundProofed,
          title: room.title,
          tv: room.tv,
        }
      : defaultValues,
    resolver: zodResolver(formSchema),
  });

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      selectedFileRef.current = file;
      setPreviewUrl(URL.createObjectURL(file));
      form.setValue("image", "pending-upload", { shouldValidate: false });
    },
    [previewUrl, form],
  );

  const handleRemoveImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    selectedFileRef.current = null;
    setPreviewUrl("");
    form.setValue("image", "", { shouldTouch: true, shouldValidate: true });
  }, [previewUrl, form]);

  const onSubmit = useCallback(
    async (values: RoomFormValues) => {
      if (!hotel) return;
      setIsLoading(true);
      try {
        let imageUrl = values.image ?? "";

        if (selectedFileRef.current) {
          const uploadResult = await startUpload([selectedFileRef.current]);
          imageUrl = uploadResult?.[0]?.ufsUrl ?? "";
          if (!imageUrl) {
            toast.error("Tải ảnh lên thất bại - không nhận được URL");
            setIsLoading(false);
            return;
          }
        } else {
          imageUrl = values.image ?? "";
          if (imageUrl === "pending-upload") imageUrl = "";
        }

        if (!imageUrl) {
          toast.error("Vui lòng chọn ảnh phòng");
          setIsLoading(false);
          return;
        }

        const submitData = { ...values, hotelId: hotel.id, image: imageUrl };

        await axios.post("/api/room", submitData);
        toast.success("Đã tạo phòng");
        handleDialogOpen();
      } catch {
        toast.error("Đã xảy ra lỗi");
      } finally {
        setIsLoading(false);
      }
    },
    [hotel, startUpload, handleDialogOpen],
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    },
    [form, onSubmit],
  );

  return (
    <Form className="space-y-6" form={form} onSubmit={handleFormSubmit}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tiêu đề phòng <span className="text-destructive">*</span>
                </FormLabel>
                <FormDescription>Nhập tên phòng</FormDescription>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="Phòng Deluxe Ocean View"
                    {...field}
                  />
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
                <FormLabel>
                  Mô tả phòng <span className="text-destructive">*</span>
                </FormLabel>
                <FormDescription>Mô tả chi tiết về phòng</FormDescription>
                <FormControl>
                  <Textarea
                    disabled={isLoading}
                    placeholder="Mô tả phòng..."
                    {...field}
                  />
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
                  Hình ảnh phòng <span className="text-destructive">*</span>
                </FormLabel>
                <FormDescription>
                  Chọn ảnh JPG hoặc PNG, tối đa 8MB
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
                        disabled={isLoading}
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
                      htmlFor="room-image-upload"
                    >
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Nhấn để chọn ảnh
                      </span>
                      <Input
                        accept="image/*"
                        className="hidden"
                        disabled={isLoading}
                        id="room-image-upload"
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
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="bedCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Giường <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      min={0}
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="guestCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Khách <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      min={0}
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bathroomCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phòng tắm <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      min={0}
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="kingBed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giường King</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      min={0}
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="queenBed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giường Queen</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      min={0}
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="roomPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Giá phòng <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormDescription>VNĐ / đêm</FormDescription>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      min={0}
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breakfastPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá bữa sáng</FormLabel>
                  <FormDescription>VNĐ (tùy chọn)</FormDescription>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      min={0}
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <FormLabel>
              Tiện ích phòng <span className="text-destructive">*</span>
            </FormLabel>
            <FormDescription>
              Chọn các tiện ích có sẵn trong phòng
            </FormDescription>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {amenities.map((amenity) => (
                <FormField
                  control={form.control}
                  key={amenity.name}
                  name={amenity.name}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 rounded-md border p-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value as boolean}
                          className="mt-0.5"
                          disabled={isLoading}
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
      <div className="flex justify-end">
        <Button disabled={isLoading} type="submit">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Đang tạo..." : "Tạo phòng"}
        </Button>
      </div>
    </Form>
  );
}
