"use client";

import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteJob } from "@/lib/action/jobs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type JobDeleteDialogProps = {
  jobId: string;
  jobTitle: string;
  onConfirm: () => void;
};

export function JobDeleteDialog({ jobId, jobTitle, onConfirm }: JobDeleteDialogProps) {
  const handleDelete = async () => {
    try {
      await deleteJob(jobId);
      onConfirm();
    } catch (error) {
      console.error("Failed to delete job", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Delete ${jobTitle}`}
            className="rounded-[7px] bg-[#242426] text-[#9c9ca4] hover:bg-[#3b2424] hover:text-red-300"
          >
            <Trash2Icon className="size-[13px]" />
          </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this job?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete “{jobTitle}”? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-black">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
