'use client';
import { Button } from '@/components/custom/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
// import { toast } from "@/components/ui/use-toast";
// import { cn } from "@/lib/utils";
import { zodResolver } from '@hookform/resolvers/zod';
// import Link from "next/link";
import { updateUser } from '@/apis/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ToastAction } from '@/components/ui/toast';
import { toast } from '@/components/ui/use-toast';
import useUserStore from '@/store/useUserStore';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { useMutation } from 'react-query';

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  name: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(10, {
      message: 'Username must not be longer than 30 characters.',
    }),

  bio: z.string().max(160).min(4),
  // urls: z
  //   .array(
  //     z.object({
  //       value: z.string().url({ message: "Please enter a valid URL." }),
  //     })
  //   )
  //   .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.

export default function ProfileForm() {
  const { user, setUser } = useUserStore();
  const [imagePreview, setImagePreview] = useState<string | null | undefined>(
    user?.profilePic,
  ); // URL tạm thời cho ảnh
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const defaultValues: Partial<ProfileFormValues> = {
    bio: user?.bio ?? '',
    username: user?.username ?? '',
    name: user?.name ?? '',
    // urls: [
    //   { value: "https://shadcn.com" },
    //   { value: "http://twitter.com/shadcn" },
    // ],
  };
  // const { fields, append } = useFieldArray({
  //   name: "urls",
  //   control: form.control,
  // });
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });
  const { isLoading, mutate } = useMutation(updateUser, {
    onSuccess: (data) => {
      setUser(data);
      toast({
        title: 'Update Success',
        action: <ToastAction altText="undo">Undo</ToastAction>,
      });
      router.push(`/profile/${user?._id}`);
    },
    onError: (error: any) => {
      console.error('Error updating user:', error);
      const errMessage =
        error?.response?.data?.error || 'Server error, please try again later';
      setErrorMessage(errMessage);
    },
  });
  function onSubmit(values: ProfileFormValues) {
    if (file) {
      const validImageTypes = /^(image\/(png|jpeg|jpg|gif|bmp|webp|jfif))$/;
      if (!validImageTypes.test(file.type)) {
        setErrorMessage(
          'Please upload a valid image (PNG, JPEG, JPG, GIF, BMP, WebP).',
        );
        return;
      }
    }
    mutate({
      username: values.username,
      name: values.name,
      bio: values.bio,
      img: file,
    });
  }
  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile?.type.includes('image')) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setImagePreview(objectUrl); // Tạo URL tạm thời để hiển thị ảnh
    } else {
      setErrorMessage('Please select a valid image file.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormItem className="flex items-center gap-4">
          <FormLabel>
            {imagePreview && (
              <Avatar className="size-24">
                <AvatarImage src={imagePreview} alt="avatar" />
                <AvatarFallback>
                  <AvatarImage
                    src="https://res.cloudinary.com/muckhotieu/image/upload/v1731805369/l60Hf_ztxub0.png"
                    alt="avatar"
                  />
                </AvatarFallback>
              </Avatar>
            )}
          </FormLabel>
          <FormControl className="flex-1 font-semibold">
            <Input
              type="file"
              accept="image/*"
              placeholder="Add profile photo"
              onChange={handleImage}
            />
          </FormControl>
        </FormItem>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage verified email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            Add URL
          </Button>
        </div> */}
        {/* Error Handling */}
        {errorMessage && (
          <p className="text-sm font-medium text-red-500 dark:text-red-900">
            {errorMessage}
          </p>
        )}
        <Button loading={isLoading} type="submit">
          Update profile
        </Button>
      </form>
    </Form>
  );
}
