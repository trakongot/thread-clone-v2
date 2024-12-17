'use client';
import useTriggerStore from '@/store/useTriggerStore';
import { useState } from 'react';
import { Button } from '../custom/button';
import { DialogContent, DialogFooter, DialogHeader } from '../custom/dialog';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { Textarea } from '../ui/textarea';

export default function ReportThreadCard() {
  const { isReportCardOpened, toggleTrigger } = useTriggerStore();
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const handleOpenChange = () => {
    toggleTrigger('isReportCardOpened');
  };
  const handleReportSubmit = () => {
    // console.log("Report submitted with reason:", reason);
    // console.log("Description:", description);
    handleOpenChange();
  };

  return (
    <Dialog open={isReportCardOpened} onOpenChange={handleOpenChange}>
      <DialogTrigger />
      <DialogContent>
        <DialogHeader>
          <div className="text-xl font-semibold">Report Thread Violation</div>
        </DialogHeader>
        <div className="space-y-4">
          {/* Select reason for reporting */}
          <div className="my-3">
            <Label className="mb-2 block text-sm font-medium text-gray-700">
              Select a Reason for Reporting
            </Label>
            <Select
              value={reason}
              onValueChange={setReason}
              // className="mt-2 w-full"
            >
              <SelectTrigger className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ">
                <span className="block truncate">
                  {reason || 'Choose a reason'}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spam">Spams</SelectItem>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="inappropriate-content">
                  Inappropriate Content
                </SelectItem>
                <SelectItem value="misleading-info">
                  Misleading Information
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Textarea for adding description */}
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Add Description (optional)
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the violation"
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleOpenChange} variant="outline" className="mr-2">
            Cancel
          </Button>
          <Button
            onClick={handleReportSubmit}
            className="bg-red-500 text-white"
          >
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
