import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import ProposalPreview from "./ProposalPreview";
import SubmissionDialog from "./SubmissionDialog";
import {
	useAccount,
	useReadContract,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";
import { smartContractAddress, smartContractABI } from "@/constants/abi";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

const formSchema = z.object({
	title: z
		.string()
		.min(5, { message: "Title must be at least 5 characters" })
		.max(100, { message: "Title must not exceed 100 characters" }),
	description: z
		.string()
		.min(20, { message: "Description must be at least 20 characters" }),
	options: z
		.array(
			z.object({
				label: z.string().min(1, { message: "Option cannot be empty" }),
			}),
		)
		.min(2, { message: "At least 2 options are required" }),
	endDate: z
		.date({
			required_error: "End date is required",
		})
		.refine((date) => date > new Date(), {
			message: "End date must be in the future",
		}),
});

type FormValues = z.infer<typeof formSchema>;

const CreateProposalPage = () => {
	const [activeTab, setActiveTab] = useState("edit");
	const [showDialog, setShowDialog] = useState(false);
	const navigate = useNavigate();

	// Wallet connection status
	const { address, isConnected } = useAccount();

	// Admin status check (contract owner)
	const { data: contractOwner, isLoading: isLoadingOwner } = useReadContract({
		address: smartContractAddress as `0x${string}`,
		abi: smartContractABI,
		functionName: "owner",
	});

	// Check if current user is admin/owner
	const isAdmin = isConnected && contractOwner === address;

	// Contract write hook for creating a proposal (updated to useWriteContract)
	const {
		data: txHash,
		writeContract,
		isPending: isWritePending,
		error: writeError,
	} = useWriteContract();

	// Wait for transaction hook (updated to useWaitForTransactionReceipt)
	const {
		isLoading: isConfirming,
		isSuccess,
		error: waitError,
	} = useWaitForTransactionReceipt({
		hash: txHash,
	});

	// Track overall submission state
	const isSubmitting = isWritePending || isConfirming;

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			options: [{ label: "Approve" }, { label: "Reject" }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		name: "options",
		control: form.control,
	});

	const watchedValues = form.watch();

	// Handle successful transaction
	useEffect(() => {
		if (isSuccess) {
			toast.success("Proposal created successfully!");
			setShowDialog(false);
			navigate({ to: "/" });
		}
	}, [isSuccess, navigate]);

	// Handle errors
	useEffect(() => {
		if (writeError || waitError) {
			toast.error(
				`Transaction failed: ${
					writeError?.message || waitError?.message || "Unknown error"
				}`,
			);
		}
	}, [writeError, waitError]);

	const onSubmit = () => {
		setShowDialog(true);
	};

	const handleConfirmSubmission = async () => {
		const values = form.getValues();

		// Convert form values to contract parameters
		const title = values.title;
		const description = values.description;
		const options = values.options.map((option) => option.label);

		// Convert JavaScript Date to Unix timestamp (seconds)
		const endTime = Math.floor(values.endDate.getTime() / 1000);

		// Call the contract using the new writeContract method
		writeContract({
			address: smartContractAddress as `0x${string}`,
			abi: smartContractABI,
			functionName: "createProposal",
			args: [title, description, options, BigInt(endTime)],
		});
	};

	// Wait for owner loading to complete
	if (!isConnected) {
		return (
			<div className="container mx-auto px-4 py-6">
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Wallet not connected</AlertTitle>
					<AlertDescription>
						You need to connect your wallet to create proposals.
					</AlertDescription>
				</Alert>
				<Button variant="outline" onClick={() => navigate({ to: "/" })}>
					Return to Dashboard
				</Button>
			</div>
		);
	}

	if (isLoadingOwner) {
		return (
			<div className="container mx-auto px-4 py-6">
				<p>Loading admin status...</p>
			</div>
		);
	}

	if (!isAdmin) {
		return (
			<div className="container mx-auto px-4 py-6">
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Access Denied</AlertTitle>
					<AlertDescription>
						You don't have permission to create proposals. Only the contract
						owner can access this feature.
					</AlertDescription>
				</Alert>
				<Button variant="outline" onClick={() => navigate({ to: "/" })}>
					Return to Dashboard
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-6 max-w-4xl">
			<h1 className="text-2xl font-bold mb-6">Create New Proposal</h1>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="edit">Edit Proposal</TabsTrigger>
					<TabsTrigger value="preview">Preview</TabsTrigger>
				</TabsList>

				<TabsContent value="edit" className="mt-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<Card>
								<CardHeader>
									<CardTitle>Proposal Details</CardTitle>
									<CardDescription>
										Enter the basic information about your proposal
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Title Field */}
									<FormField
										control={form.control}
										name="title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter proposal title"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Clear and concise title for your proposal
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Description Field */}
									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Provide a detailed description of your proposal"
														className="min-h-[150px]"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Markdown formatting is supported. Explain what you're
													proposing and why.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Voting Options</CardTitle>
									<CardDescription>
										Define the choices voters will have
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{fields.map((field, index) => (
											<div key={field.id} className="flex gap-3">
												<FormField
													control={form.control}
													name={`options.${index}.label`}
													render={({ field }) => (
														<FormItem className="flex-1">
															<FormControl>
																<Input
																	placeholder={`Option ${index + 1}`}
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												{index > 1 && (
													<Button
														type="button"
														variant="outline"
														size="icon"
														onClick={() => remove(index)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												)}
											</div>
										))}
									</div>

									<Button
										type="button"
										variant="outline"
										size="sm"
										className="mt-4"
										onClick={() => append({ label: "" })}
									>
										<Plus className="h-4 w-4 mr-2" />
										Add Option
									</Button>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Proposal Settings</CardTitle>
									<CardDescription>
										Configure additional settings for your proposal
									</CardDescription>
								</CardHeader>
								<CardContent>
									{/* End Date Field */}
									<FormField
										control={form.control}
										name="endDate"
										render={({ field }) => (
											<FormItem className="flex flex-col">
												<FormLabel>End Date</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant={"outline"}
																className={cn(
																	"w-full pl-3 text-left font-normal",
																	!field.value && "text-muted-foreground",
																)}
															>
																{field.value ? (
																	format(field.value, "PPP")
																) : (
																	<span>Pick a date</span>
																)}
																<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="start">
														<Calendar
															mode="single"
															selected={field.value}
															onSelect={field.onChange}
															disabled={(date) => date < new Date()}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
												<FormDescription>
													The date when voting will automatically end
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							<div className="flex justify-between">
								<Button
									variant="outline"
									type="button"
									onClick={() => navigate({ to: "/" })}
								>
									Cancel
								</Button>
								<div className="space-x-2">
									<Button
										variant="outline"
										type="button"
										onClick={() => setActiveTab("preview")}
									>
										Preview
									</Button>
									<Button type="submit">Submit Proposal</Button>
								</div>
							</div>
						</form>
					</Form>
				</TabsContent>

				<TabsContent value="preview">
					<ProposalPreview
						data={watchedValues}
						onBack={() => setActiveTab("edit")}
						onSubmit={form.handleSubmit(onSubmit)}
					/>
				</TabsContent>
			</Tabs>

			<SubmissionDialog
				open={showDialog}
				onClose={() => !isSubmitting && setShowDialog(false)}
				onConfirm={handleConfirmSubmission}
				isSubmitting={isSubmitting}
				proposal={watchedValues}
				transactionHash={txHash}
			/>
		</div>
	);
};

export default CreateProposalPage;
