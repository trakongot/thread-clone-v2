'use client';
import { Button } from '@/components/custom/button';
import { toast } from '@/components/ui/use-toast';
import emailjs from '@emailjs/browser';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

// Define types for contact sections and form data
interface ContactSection {
  title: string;
  content: string | string[];
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactUs() {
  const contactSections: ContactSection[] = [
    {
      title: 'Contact Us',
      content:
        "We'd love to hear from you! Whether you have questions, feedback, or need assistance, feel free to reach out.",
    },
    {
      title: '1. Customer Support',
      content: [
        'For help or support, email us at: support@threadsapp.com.',
        'We typically respond within 24-48 hours.',
      ],
    },
    {
      title: '3. Report Issues',
      content: [
        'To report a bug or content violation, email: report@threadsapp.com.',
        'We aim to resolve issues quickly.',
      ],
    },
    {
      title: '4. Our Address',
      content: [
        'Threads Inc.',
        '1234 Social Lane, Suite 101',
        'Metropolis, TS 54321',
      ],
    },
  ];

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  // Handle input field changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Mutate function to send email via emailjs
  const sendMessage = async () => {
    return await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '',
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '',
      formData,
      process.env.NEXT_PUBLIC_EMAILJS_USER_ID ?? '',
    );
  };

  // React Query mutation hook
  const { mutate, isLoading } = useMutation(sendMessage, {
    onSuccess: () => {
      toast({
        title: "Thank you for your message! We'll get back to you soon.",
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: 'Failed to send message. Please try again later.',
      });
    },
  });

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'All fields are required',
      });
      return;
    }

    mutate();
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-slate-800" id="contact">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:pb-20">
          <div className="w-full">
            <div>
              {contactSections.map((section) => (
                <div key={uuidv4()} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {section.title}
                  </h3>
                  {Array.isArray(section.content) ? (
                    <ul className="mt-2 text-gray-600 dark:text-slate-400">
                      {section.content.map((line) => (
                        <li key={uuidv4()}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-gray-600 dark:text-slate-400">
                      {section.content}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-900">
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Send Us a Message
              </h3>
              <form id="contactForm" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:bg-slate-700 dark:text-white"
                  ></textarea>
                </div>
                <Button
                  loading={isLoading}
                  type="submit"
                  className="w-full rounded-md px-4 py-2 text-white transition-colors"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
