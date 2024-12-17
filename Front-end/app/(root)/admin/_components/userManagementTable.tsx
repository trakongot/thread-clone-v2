'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from '@/types/userType';

const users: User[] = [
  {
    _id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    username: 'nguyenvana',
    bio: 'Yêu công nghệ và phát triển phần mềm.',
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
    onboarded: true,
    followers: ['2', '3', '4'],
    following: ['5', '6'],
    role: 'user',
    accountStatus: 'active',
    viewedThreads: ['1', '3', '5'],
    saves: ['2', '4', '6'],
    reposts: ['7', '8'],
    blockedUsers: ['9'],
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-12-01T12:00:00Z',
  },
  {
    _id: '2',
    name: 'Nguyễn Gia Hân',
    email: 'tranthib@gmail.com',
    username: 'tranthib',
    bio: 'Chuyên gia marketing, đam mê đọc sách.',
    profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
    onboarded: true,
    followers: ['1', '3'],
    following: ['4', '5'],
    role: 'user',
    accountStatus: 'active',
    viewedThreads: ['2', '4'],
    saves: ['5', '6'],
    reposts: ['7'],
    blockedUsers: ['8'],
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-12-02T15:00:00Z',
  },
  {
    _id: '3',
    name: 'Nguyễn Minh Thi',
    email: 'phamminhc@gmail.com',
    username: 'phamminhc',
    bio: 'Lập trình viên và yêu thích làm game.',
    profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
    onboarded: true,
    followers: ['1', '2', '4'],
    following: ['3', '5'],
    role: 'admin',
    accountStatus: 'active',
    viewedThreads: ['1', '6'],
    saves: ['2', '3', '4'],
    reposts: ['5'],
    blockedUsers: ['6'],
    createdAt: '2024-02-10T09:30:00Z',
    updatedAt: '2024-12-01T16:00:00Z',
  },
  {
    _id: '4',
    name: 'Lê Thi Hà',
    email: 'lethid@gmail.com',
    username: 'lethid',
    bio: 'Sinh viên ngành thiết kế đồ họa.',
    profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
    onboarded: true,
    followers: ['1', '3'],
    following: ['5', '6'],
    role: 'user',
    accountStatus: 'inactive',
    viewedThreads: ['4', '5'],
    saves: ['2', '3'],
    reposts: ['1'],
    blockedUsers: ['9'],
    createdAt: '2024-02-15T10:15:00Z',
    updatedAt: '2024-12-03T12:30:00Z',
  },
  {
    _id: '5',
    name: 'Ngô Văn E',
    email: 'ngovane@gmail.com',
    username: 'ngovane',
    bio: 'Chuyên gia tài chính, thích đầu tư.',
    profilePic: 'https://randomuser.me/api/portraits/men/3.jpg',
    onboarded: true,
    followers: ['6', '7', '8'],
    following: ['9', '10'],
    role: 'user',
    accountStatus: 'active',
    viewedThreads: ['2', '5'],
    saves: ['1', '4'],
    reposts: ['8'],
    blockedUsers: ['3'],
    createdAt: '2024-03-05T11:20:00Z',
    updatedAt: '2024-12-04T13:40:00Z',
  },
  {
    _id: '6',
    name: 'Hoàng Thị F',
    email: 'hoangthif@gmail.com',
    username: 'hoangthif',
    bio: 'Nhiếp ảnh gia yêu thiên nhiên và du lịch.',
    profilePic: 'https://randomuser.me/api/portraits/women/3.jpg',
    onboarded: true,
    followers: ['1', '2'],
    following: ['3', '4'],
    role: 'admin',
    accountStatus: 'active',
    viewedThreads: ['2', '3'],
    saves: ['4', '5'],
    reposts: ['1'],
    blockedUsers: ['7'],
    createdAt: '2024-03-20T17:25:00Z',
    updatedAt: '2024-12-05T14:00:00Z',
  },
  {
    _id: '7',
    name: 'Vũ Minh G',
    email: 'vuminhg@gmail.com',
    username: 'vuminhg',
    bio: 'Giám đốc công ty khởi nghiệp.',
    profilePic: 'https://randomuser.me/api/portraits/men/4.jpg',
    onboarded: true,
    followers: ['2', '4', '6'],
    following: ['5', '8'],
    role: 'user',
    accountStatus: 'inactive',
    viewedThreads: ['1', '7'],
    saves: ['6', '3'],
    reposts: ['2'],
    blockedUsers: ['9'],
    createdAt: '2024-04-10T08:30:00Z',
    updatedAt: '2024-12-05T15:00:00Z',
  },
  {
    _id: '8',
    name: 'Đặng Thị H',
    email: 'dangthih@gmail.com',
    username: 'dangthih',
    bio: 'Tôi yêu động vật và chăm sóc thú cưng.',
    profilePic: 'https://randomuser.me/api/portraits/women/4.jpg',
    onboarded: true,
    followers: ['1', '5', '9'],
    following: ['2', '3'],
    role: 'user',
    accountStatus: 'active',
    viewedThreads: ['3', '6'],
    saves: ['1', '7'],
    reposts: ['9'],
    blockedUsers: ['4'],
    createdAt: '2024-04-15T10:40:00Z',
    updatedAt: '2024-12-05T16:00:00Z',
  },
  {
    _id: '9',
    name: 'Phan Vũ Thi',
    email: 'phanthii@gmail.com',
    username: 'phanthii',
    bio: 'Chuyên gia phân tích dữ liệu, đam mê nghiên cứu khoa học.',
    profilePic: 'https://randomuser.me/api/portraits/women/5.jpg',
    onboarded: true,
    followers: ['6', '7'],
    following: ['8'],
    role: 'admin',
    accountStatus: 'active',
    viewedThreads: ['5', '8'],
    saves: ['2', '4'],
    reposts: ['3'],
    blockedUsers: ['1'],
    createdAt: '2024-05-01T14:50:00Z',
    updatedAt: '2024-12-05T17:10:00Z',
  },
  {
    _id: '10',
    name: 'Bùi Minh J',
    email: 'buiminhj@gmail.com',
    username: 'buiminhj',
    bio: 'Chuyên gia IT, thích lập trình web.',
    profilePic: 'https://randomuser.me/api/portraits/men/5.jpg',
    onboarded: true,
    followers: ['1', '4', '8'],
    following: ['6', '7'],
    role: 'user',
    accountStatus: 'inactive',
    viewedThreads: ['2', '6'],
    saves: ['5', '8'],
    reposts: ['7'],
    blockedUsers: ['9'],
    createdAt: '2024-05-10T16:15:00Z',
    updatedAt: '2024-12-05T18:00:00Z',
  },
];

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Email
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => <div>{row.getValue('username')}</div>,
  },
  // {
  //   accessorKey: "bio",
  //   header: "Bio",
  //   cell: ({ row }) => <div>{row.getValue("bio")}</div>,
  // },
  // {
  //   accessorKey: "role",
  //   header: "Role",
  //   cell: ({ row }) => <div>{row.getValue("role")}</div>,
  // },
  {
    accessorKey: 'accountStatus',
    header: 'Account Status',
    cell: ({ row }) => <div>{row.getValue('accountStatus')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user._id)}
            >
              View detail
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function AdminUserTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      // Set default visible columns, e.g., status and email
      status: true,
      email: true,
      amount: false, // Example: amount column hidden by default
    });
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
