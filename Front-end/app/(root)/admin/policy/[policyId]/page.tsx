'use client';
import { getPolicyById, togglePolicyStatus } from '@/apis/policy';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PolicyDetail() {
  const { policyId } = useParams();
  const [policy, setPolicy] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (policyId) {
      getPolicyById({ id: policyId.toString() })
        .then((data) => {
          setPolicy(data.policy);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching policy details:', error);
          setError('Failed to load policy details');
          setLoading(false);
        });
      console.log(policy);
    }
  }, [policyId]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  console.log('Policy ID:', policy._id);

  return (
    <section className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Policy Details</h1>
      <div className="rounded-lg bg-white p-6 shadow-md">
        <table className="min-w-full table-auto">
          <tbody>
            <tr className="transition-colors hover:bg-gray-100">
              <td className="px-4 py-2 font-semibold">Policy ID:</td>
              <td className="px-4 py-2">{policy._id}</td>
            </tr>
            <tr className="transition-colors hover:bg-gray-100">
              <td className="px-4 py-2 font-semibold">Title:</td>
              <td className="px-4 py-2">{policy.title}</td>
            </tr>
            <tr className="transition-colors hover:bg-gray-100">
              <td className="px-4 py-2 font-semibold">Created By:</td>
              <td className="px-4 py-2">
                {policy.createdBy?.name || policy.createdBy?.email || 'Unknown'}
              </td>
            </tr>
            <tr className="transition-colors hover:bg-gray-100">
              <td className="px-4 py-2 font-semibold">Status:</td>
              <td className="px-4 py-2">
                <button
                  className={`rounded-md px-6 py-2 text-white ${
                    policy.status === 'Active'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  } transition-colors`}
                >
                  {policy.status === 'Active' ? 'Inactive' : 'Active'}
                </button>
                {/* {policy.status} */}
              </td>
            </tr>
            <tr className="transition-colors hover:bg-gray-100">
              <td className="px-4 py-2 font-semibold">Content:</td>
              <td className="px-4 py-2">{policy.content}</td>
            </tr>
            <tr className="transition-colors hover:bg-gray-100">
              <td className="px-4 py-2 font-semibold">Created At:</td>
              <td className="px-4 py-2">
                {new Date(policy.createdAt).toLocaleDateString()}
              </td>
            </tr>
          </tbody>
        </table>

        <Button
          variant="outline"
          className="mt-6"
          onClick={() => router.push('/admin/policy')}
        >
          Back
        </Button>
      </div>
    </section>
  );
}
