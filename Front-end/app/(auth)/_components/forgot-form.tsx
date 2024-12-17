'use client';

import { Button } from '@/components/custom/button';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { HTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { forgotPassword } from '@/apis/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useMutation } from 'react-query';

interface ForgotFormProps extends HTMLAttributes<HTMLDivElement> {
  onSuccess?: () => void;
}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
});

export function ForgotForm({
  className,
  onSuccess,
  ...props
}: ForgotFormProps) {
  const { mutate, isLoading } = useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: () => {
      toast({ title: 'Email sent successfully! Check your inbox.' });
      if (onSuccess) onSuccess();
    },
    onError: (error: unknown) => {
      console.error('Failed to send reset password email:', error);
      toast({ title: 'Sever đang bảo trì vui lòng thử lại sau' });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(data.email);
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
            <Button className="mt-2" loading={isLoading}>
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
