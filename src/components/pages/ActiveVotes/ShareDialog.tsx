import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Twitter, Facebook, Linkedin, Copy, Check, Share2 } from "lucide-react";

type ShareDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	id: string;
};

const ShareDialog = ({ open, onOpenChange, title, id }: ShareDialogProps) => {
	const [copied, setCopied] = useState(false);

	// Base URL of the application (would come from environment variables in a real app)
	const baseUrl = "https://votingapp.com";

	// The URL to be shared
	const shareUrl = `${baseUrl}/proposals/${id}`;

	const handleCopyLink = () => {
		navigator.clipboard.writeText(shareUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleShareTwitter = () => {
		const text = `Check out this vote: "${title}"`;
		const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
		window.open(url, "_blank");
	};

	const handleShareFacebook = () => {
		const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
		window.open(url, "_blank");
	};

	const handleShareLinkedin = () => {
		const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
		window.open(url, "_blank");
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Share2 className="h-4 w-4" />
						Share this Vote
					</DialogTitle>
					<DialogDescription>
						Share the current voting results with others
					</DialogDescription>
				</DialogHeader>

				<div className="flex items-center space-x-2 mt-4">
					<div className="grid flex-1 gap-2">
						<Input readOnly value={shareUrl} className="bg-slate-900" />
					</div>
					<Button size="sm" className="px-3" onClick={handleCopyLink}>
						{copied ? (
							<Check className="h-4 w-4" />
						) : (
							<Copy className="h-4 w-4" />
						)}
						<span className="sr-only">Copy</span>
					</Button>
				</div>

				<div className="flex justify-center gap-4 mt-4">
					<Button
						size="icon"
						variant="outline"
						onClick={handleShareTwitter}
						className="rounded-full h-10 w-10"
					>
						<Twitter className="h-5 w-5 text-blue-400" />
					</Button>
					<Button
						size="icon"
						variant="outline"
						onClick={handleShareFacebook}
						className="rounded-full h-10 w-10"
					>
						<Facebook className="h-5 w-5 text-blue-600" />
					</Button>
					<Button
						size="icon"
						variant="outline"
						onClick={handleShareLinkedin}
						className="rounded-full h-10 w-10"
					>
						<Linkedin className="h-5 w-5 text-blue-500" />
					</Button>
				</div>

				<DialogFooter className="sm:justify-center">
					<Button variant="secondary" onClick={() => onOpenChange(false)}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ShareDialog;
