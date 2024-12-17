'use client';
import { getPolicies } from '@/apis/policy';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';

function PolicyPage() {
  const [policySections, setPolicySections] = useState<any[]>([]);

  const fetchPolicies = async () => {
    try {
      const response = await getPolicies({ pageNumber: 1, pageSize: 20 });
      setPolicySections(response.policies);
    } catch (error) {
      console.error('Error fetching policies:', error);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  return (
    <ScrollArea className="h-[800px] px-24 pb-24">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Privacy policy
        </h1>

        <p className="pt-7">
          Welcome to Threads! Your privacy is important to us. This Privacy
          Policy outlines how we handle your personal information when you use
          our application.
        </p>
      </div>
      <div className="text-left">
        {policySections.map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-blue-600 dark:text-blue-200 mb-2 text-lg font-semibold uppercase tracking-wide">
              {section.title}
            </h2>

            <div className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              {Array.isArray(section.content) ? (
                (section.content as string[]).map(
                  (item: string, idx: number) => (
                    <p key={idx} className="mb-2">
                      {item}
                    </p>
                  ),
                )
              ) : (
                <p>{section.content}</p>
              )}
            </div>
          </div>
        ))}
        <Button variant="outline" className="mt-6">
          Return to Home
        </Button>
      </div>
    </ScrollArea>
  );
}
export default PolicyPage;
