'use client';
import { createPolicy, getPolicies, togglePolicyStatus } from '@/apis/policy';

import { Button } from '@/components/custom/button';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { toast } from '@/components/ui/use-toast';
import { GripIcon } from 'lucide-react';
import Link from 'next/link';
// import { useParams } from 'next/navigation';
import { Form, Input, Modal, Select } from 'antd';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query'; // React Query hook
export default function PolicyPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 3;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [policies, setPolicies] = useState<any[]>([]);
  const [policy, setPolicy] = useState<any | null>(null);
  // const { policyId } = useParams();
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [filter, setFilter] = useState('');

  const {
    data,
    error,
    isLoading: isLoadingGet,
    refetch: refetchPolicies,
  } = useQuery(
    ['policies', pageNumber, isUpdate, filter],
    () => getPolicies({ pageNumber, pageSize, filter }),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        console.log('Fetched data:', data);
        setPolicies(data.policies);
        // setPolicies((prevThreads) => [...prevThreads, ...data.policies]);
      },
      onError: (error) => {
        console.error('Error fetching policies:', error);
      },
    },
  );
  // const router = useRouter();
  const { mutate, isLoading: isLoadingCreate } = useMutation({
    mutationFn: ({ title, content }: { title: string; content: string }) =>
      createPolicy({ title, content }),
    onSuccess: (data) => {
      toast({ title: 'Success', description: 'Policy created successfully.' });
      // console.log('Policy created:', data);
      setOpenModal(false);
      refetchPolicies();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong.',
      });
      console.error('Error creating policy:', error);
    },
  });

  const handleOk = async () => {
    const value = await form.validateFields();
    const { title, content } = value;
    mutate({ title, content });
  };
  const handleStatusChange = (value: string) => {
    setFilter(value);
    setPageNumber(1);
    console.log('hưhwhw');
    refetchPolicies();
  };

  const handleToggleStatus = async (policyId: string) => {
    try {
      const updatedPolicy = await togglePolicyStatus({
        id: policyId,
      });
      setPolicy(updatedPolicy.updatedPolicy);
      setIsUpdate(!isUpdate);
    } catch (error) {
      console.error('Error toggling policy status:', error);
    }
  };
  if (isLoadingGet) return <p>Loading policies...</p>;
  if (error) return <p>Error fetching policies</p>;

  return (
    <section className="p-6">
      <Modal
        closable={false}
        centered
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          form.resetFields(); // Reset form fields
        }}
        footer={null}
        width={700}
      >
        <div className={`p-4 `}>
          <h1 className={`text-center text-3xl font-bold`}>Add policy</h1>
          <Form form={form} layout="vertical">
            <Form.Item
              label={<span className={`  `}>Title</span>}
              name="title"
              rules={[{ required: true, message: 'Title is required' }]}
            >
              <Input placeholder="Enter title" />
            </Form.Item>

            <Form.Item
              label={<span className={`  `}>Content</span>}
              name="content"
              rules={[{ required: true, message: 'Content is required' }]}
            >
              <Input.TextArea placeholder="Enter  content" />
            </Form.Item>
          </Form>
          <div className="item-center flex justify-end text-end">
            <Button
              key="back"
              onClick={() => {
                setOpenModal(false);
                form.resetFields(); // Reset form fields
              }}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button key="submit" onClick={handleOk} loading={isLoadingCreate}>
              <p className="flex text-white">Add</p>
            </Button>
          </div>
        </div>
      </Modal>

      <h1 className="mb-4 text-2xl font-bold">Policies List</h1>

      <div className="mb-4">
        <Button
          onClick={() => setOpenModal(true)}
          className="rounded-md bg-black px-4 py-2 text-white transition hover:bg-white hover:text-black"
        >
          Create Policy
        </Button>
      </div>
      <div className="mb-4 flex items-center gap-4">
        <Select
          value={filter}
          onChange={handleStatusChange}
          placeholder="Filter by Status"
          style={{ width: 200 }}
          allowClear
        >
          <Select.Option value="">All</Select.Option>
          <Select.Option value="Active">Active</Select.Option>
          <Select.Option value="Inactive">Inactive</Select.Option>
        </Select>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse bg-white">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Policy ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase"></th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Created By
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {policies?.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  No policies found
                </td>
              </tr>
            ) : (
              policies?.map((policy) => (
                <tr
                  key={policy._id}
                  className="border-b transition duration-200 ease-in-out hover:bg-gray-100"
                >
                  <td className="px-6 py-3 text-sm">{policy._id}</td>
                  <td className="px-6 py-3 text-sm">{policy.title}</td>
                  <td className="max-w-[300px] break-words px-6 py-3 text-sm ">
                    {policy.content}
                  </td>

                  <td className="px-6 py-3 text-sm">
                    {policy.createdBy?.name ||
                      policy.createdBy?.email ||
                      'Unknown'}
                  </td>
                  <td className="px-6 py-3 text-sm">{policy.status}</td>
                  <td className="px-6 py-3 text-sm">
                    {policy.createdAt
                      ? new Date(policy.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <Menubar>
                      <MenubarMenu>
                        <MenubarTrigger className="flex items-center rounded-full p-2 transition-all duration-150 hover:bg-[#e1e1e1] active:scale-95 data-[state=open]:bg-[#e1e1e1]">
                          <GripIcon className="size-6 cursor-pointer " />
                        </MenubarTrigger>
                        <MenubarContent align="end">
                          <Link href={`/admin/policy/${policy._id}`}>
                            <MenubarItem className="flex cursor-default items-center  justify-between py-2 text-center">
                              View
                            </MenubarItem>
                          </Link>
                          <MenubarSeparator />
                          <button
                            onClick={() => handleToggleStatus(policy._id)}
                          >
                            <MenubarItem className="flex cursor-default items-center justify-between py-2 text-center">
                              Delete
                            </MenubarItem>
                          </button>
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber === 1}
        >
          Previous
        </Button>
        <span className="text-sm font-medium">Page {pageNumber}</span>
        <Button
          onClick={() => setPageNumber((prev) => prev + 1)}
          disabled={data && data.policies.length < pageSize}
        >
          Next
        </Button>
      </div>
    </section>
  );
}
