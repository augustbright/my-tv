'use client';

import { useQueryMyMedia } from '@/app/queries/myMedia';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableLoader,
  TableRow,
} from '@/components/ui/table';
import { Loader, MoreHorizontal } from 'lucide-react';
import { ContentRow } from './content-row';

export const MyContent = () => {
  const { data: myMedia, isLoading } = useQueryMyMedia();
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>My Content</CardTitle>
        <CardDescription>
          Manage your videos and view their status``.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[200px] sm:table-cell">
                <span className="sr-only">Preview</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody isLoading={isLoading}>
            {myMedia?.data.map((video) => (
              <ContentRow key={video.id} video={video} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          {/* Showing <strong>1-10</strong> of <strong>32</strong> products */}
        </div>
      </CardFooter>
    </Card>
  );
};
