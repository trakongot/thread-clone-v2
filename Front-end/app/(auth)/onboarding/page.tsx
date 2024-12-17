import { ScrollArea } from '@/components/ui/scroll-area';
import { Metadata } from 'next';
import { OnboardingForm } from '../_components/onboarding-form';

export const metadata: Metadata = {
  title: 'Auth',
};

export default function Page() {
  return (
    <ScrollArea className="h-[800px] px-24 pb-24">
      <main className="mx-auto mt-20 flex max-w-3xl flex-col justify-start rounded-[24px] bg-light-1 px-10 py-20 shadow-form">
        <h1 className="head-text text-dark-1">Onboarding</h1>
        <p className=" mt-3 text-dark-3">
          Complete your profile now, to use Threds.
        </p>
        <section className="mt-9 pb-40">
          <OnboardingForm />
        </section>
      </main>
    </ScrollArea>
  );
}
