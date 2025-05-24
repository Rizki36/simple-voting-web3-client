import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type SubmissionDialogProps = {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isSubmitting: boolean;
	proposal: {
		title: string;
		description: string;
		options: { label: string }[];
		endDate?: Date;
	};
};

const SubmissionDialog = ({
	open,
	onClose,
	onConfirm,
	isSubmitting,
	proposal,
}: SubmissionDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Confirm Submission</DialogTitle>
					<DialogDescription>
						You are about to submit this proposal to the blockchain. This action
						cannot be undone.
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<div className="mb-4">
						<h3 className="text-sm font-medium text-slate-400">Title</h3>
						<p className="font-medium">{proposal.title}</p>
					</div>

					<div className="mb-4">
						<h3 className="text-sm font-medium text-slate-400">Options</h3>
						<p>{proposal.options.map((o) => o.label).join(", ")}</p>
					</div>

					<div className="mb-4">
						<h3 className="text-sm font-medium text-slate-400">End Date</h3>
						<p>
							{proposal.endDate ? format(proposal.endDate, "PPP") : "Not set"}
						</p>
					</div>

					<div className="bg-slate-800 p-3 rounded-md mt-4 text-xs">
						<p className="font-medium text-slate-300 mb-1">
							Transaction Information:
						</p>
						<div className="flex justify-between">
							<span className="text-slate-400">Estimated Gas:</span>
							<span>~0.005 ETH</span>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isSubmitting}>
						Cancel
					</Button>
					<Button onClick={onConfirm} disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Submitting...
							</>
						) : (
							"Confirm & Submit"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default SubmissionDialog;
