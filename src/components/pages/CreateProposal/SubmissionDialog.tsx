import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

type SubmissionDialogProps = {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isSubmitting: boolean;
	proposal: {
		title: string;
		description: string;
		options: { label: string }[];
		endDate: Date;
	};
	transactionHash?: `0x${string}`;
};

const SubmissionDialog = ({
	open,
	onClose,
	onConfirm,
	isSubmitting,
	proposal,
	transactionHash,
}: SubmissionDialogProps) => {
	const { title, endDate, options } = proposal;

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Confirm Proposal Submission</DialogTitle>
					<DialogDescription>
						You're about to submit this proposal to the blockchain. This action
						cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<h3 className="font-medium">{title}</h3>
					<p className="text-sm text-muted-foreground mt-1">
						Voting ends: {endDate ? format(endDate, "PPP") : "Not set"}
					</p>
					<div className="mt-4">
						<h4 className="text-sm font-medium">Voting options:</h4>
						<ul className="mt-2 text-sm">
							{options.map((option, index) => (
								<li key={index} className="list-disc ml-4">
									{option.label}
								</li>
							))}
						</ul>
					</div>

					{transactionHash && (
						<div className="mt-4 p-3 bg-secondary rounded-md">
							<p className="text-xs font-medium">Transaction Hash:</p>
							<p className="text-xs break-all mt-1 text-muted-foreground">
								{transactionHash}
							</p>
						</div>
					)}
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isSubmitting}>
						Cancel
					</Button>
					<Button
						onClick={onConfirm}
						disabled={isSubmitting || !!transactionHash}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{transactionHash ? "Processing..." : "Confirming..."}
							</>
						) : (
							"Submit Proposal"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default SubmissionDialog;
