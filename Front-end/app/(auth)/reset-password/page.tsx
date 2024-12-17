'use client';

import { resetPassword } from '@/apis/auth';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { z } from 'zod';

const formSchema = z.object({
  newPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' }),
});

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => {
      return await resetPassword({ token, newPassword });
    },
    onSuccess: (data) => {
      toast({ title: 'cài lại mật khẩu thành công' });
      router.push('/sign-in');
    },
    onError: (error: unknown) => {
      console.error('Failed to reset password:', error);
      toast({ title: 'lỗi không xác định' });
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { newPassword: '' },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!token) {
      toast({ title: 'token đã hết hạn' });
      return;
    }
    mutate({ token, newPassword: data.newPassword });
  };

  return (
    <div className="container flex min-h-screen items-center justify-center">
      <div className="mt-8 w-full max-w-lg rounded bg-white p-8 shadow">
        <h1 className="mb-4 text-xl font-semibold">Reset Password</h1>
        {!token ? (
          <p className="text-red-500">Invalid or expired token.</p>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="relative mb-4">
              <label className="mb-2 block text-sm font-medium">
                New Password
              </label>
              <div className="relative">
                <Input
                  {...form.register('newPassword')}
                  type={isPasswordVisible ? 'text' : 'password'} // Thay đổi type dựa trên trạng thái
                  placeholder="Enter new password"
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute inset-y-0 right-0 px-3 text-gray-500"
                >
                  {isPasswordVisible ? 'Hide' : 'Show'}
                </button>
              </div>
              {form.formState.errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <Button loading={isLoading} type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
