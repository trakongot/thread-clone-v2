'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { updateUserOnboarded } from '@/apis/user';
import { Button } from '@/components/custom/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useUserStore from '@/store/useUserStore';
import { User } from '@/types/userType';
import { useMutation } from 'react-query';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Minimum 3 characters.' })
    .max(15, { message: 'Maximum 15 characters.' }),
  username: z
    .string()
    .min(3, { message: 'Minimum 3 characters.' })
    .max(15, { message: 'Maximum 14 characters.' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        'Username must contain only letters, numbers, and underscores, and no spaces or special characters.',
    }),
  bio: z
    .string()
    .min(3, { message: 'Minimum 3 characters.' })
    .max(1000, { message: 'Maximum 1000 characters.' }),
});

export const OnboardingForm = () => {
  const router = useRouter();
  const { user } = useUserStore();
  if (!user) router.push('./sign-in');
  if (user?.onboarded) router.push('./');
  const updateUser = useUserStore((state) => state.updateUser);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // URL tạm thời cho ảnh
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // API mutation setup with React Query
  const { isLoading, mutate: mutateOnboarding } = useMutation({
    mutationFn: updateUserOnboarded,
    onSuccess: (data: { user: User }) => {
      updateUser(data.user);
      setTimeout(() => {
        router.push('./');
      }, 2000);
    },
    onError: (error: any) => {
      console.error('Error updating user:', error);
      const errMessage =
        error?.response?.data?.error || 'Server error, please try again later';
      setErrorMessage(errMessage); // Set error message from API
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.username ?? '',
      username: user?.username ?? '',
      bio: user?.bio ?? '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!file) {
      setErrorMessage('Please upload a profile photo.');
      return;
    }
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setErrorMessage('Please upload a valid image (PNG, JPEG).');
      return;
    }
    // Trigger mutation with form data and image file
    mutateOnboarding({
      name: values.name,
      username: values.username,
      bio: values.bio,
      img: file,
    });
  };

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
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
          name="name"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="font-semibold">Name</FormLabel>
              <FormControl>
                <Input type="text" className="no-focus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="font-semibold">Username</FormLabel>
              <FormControl>
                <Input type="text" className="no-focus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="font-semibold">Bio</FormLabel>
              <FormControl>
                <Textarea rows={10} className="no-focus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error Handling */}
        {errorMessage && (
          <p className="text-sm font-medium text-red-500 dark:text-red-900">
            {errorMessage}
          </p>
        )}
        <Button className="mt-2" loading={isLoading}>
          Continue
        </Button>
      </form>
    </Form>
  );
};
