'use client';
import { signinUser } from '@/apis/auth';
import { Button } from '@/components/custom/button';
import { PasswordInput } from '@/components/custom/password-input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import useUserStore from '@/store/useUserStore';
import { User } from '@/types/userType';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandFacebook, IconBrandInstagram } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HTMLAttributes, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { z } from 'zod';
interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(6, {
      message: 'Password must be at least 6 characters long',
    })
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/, {
      message:
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    }),
});

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // api react query
  const { isLoading, mutate: mutateSignIn } = useMutation(signinUser, {
    onSuccess: (data: User) => {
      setUser(data);
      if (!data.onboarded) router.push('./onboarding');
      if (data.role === 'super_admin') router.push('./admin');
    },
    onError: (error: any) => {
      console.error('Sign in error:', error);
      const errMessage =
        error?.response?.data?.error || 'Server error, please try again later';
      setErrorMessage(errMessage);
    },
  });
  // end api react query
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'tudinhle100@gmail.com',
      password: 'Cacancap777@@',
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutateSignIn({ ...data });
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href={'/forgot-password'}
                      className="text-sm font-medium text-muted-foreground hover:opacity-75"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error handling */}
            {errorMessage && (
              <p className="text-sm font-medium text-red-500 dark:text-red-900">
                {errorMessage ?? 'An error occurred, please try again.'}
              </p>
            )}

            <Button className="mt-2" loading={isLoading}>
              Login
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="w-full"
                type="button"
                leftSection={<IconBrandInstagram className="size-4" />}
              >
                Instagram
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                leftSection={<IconBrandFacebook className="size-4" />}
              >
                Facebook
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
