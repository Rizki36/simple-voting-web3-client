import { useState } from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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

// Schema for form validation
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
	votingSystem: z.enum(["simple", "weighted", "quadratic"]),
	eligibility: z.enum(["all", "token", "nft"]),
	minTokens: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateProposalPage = () => {
	const [activeTab, setActiveTab] = useState("edit");
	const [showDialog, setShowDialog] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isAdmin, setIsAdmin] = useState(true); // Mock admin check, will be replaced with real check later

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			options: [{ label: "Approve" }, { label: "Reject" }],
			votingSystem: "simple",
			eligibility: "all",
			minTokens: 0,
		},
	});

	const { fields, append, remove } = useFieldArray({
		name: "options",
		control: form.control,
	});

	const watchedValues = form.watch();

	// This would be replaced with a real contract call
	const onSubmit = async (values: FormValues) => {
		setShowDialog(true);
	};

	const handleConfirmSubmission = async () => {
		setIsSubmitting(true);

		// Simulate blockchain transaction
		await new Promise((resolve) => setTimeout(resolve, 2000));

		setIsSubmitting(false);
		setShowDialog(false);

		// Navigate to proposal list or show success message
	};

	if (!isAdmin) {
		return (
			<div className="container mx-auto px-4 py-6">
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Access Denied</AlertTitle>
					<AlertDescription>
						You don't have permission to create proposals. Only administrators
						can access this feature.
					</AlertDescription>
				</Alert>
				<Button variant="outline">Return to Dashboard</Button>
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
								<CardContent className="space-y-6">
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

									{/* Voting System Field */}
									<FormField
										control={form.control}
										name="votingSystem"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Voting System</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select voting system" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="simple">
															Simple Majority
														</SelectItem>
														<SelectItem value="weighted">
															Weighted Voting
														</SelectItem>
														<SelectItem value="quadratic">
															Quadratic Voting
														</SelectItem>
													</SelectContent>
												</Select>
												<FormDescription>
													How votes will be counted and winners determined
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Eligibility Field */}
									<FormField
										control={form.control}
										name="eligibility"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Voter Eligibility</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select eligibility requirement" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="all">
															All Wallet Addresses
														</SelectItem>
														<SelectItem value="token">Token Holders</SelectItem>
														<SelectItem value="nft">NFT Holders</SelectItem>
													</SelectContent>
												</Select>
												<FormDescription>
													Who can participate in this proposal's voting
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Conditional Field: Min Tokens */}
									{form.watch("eligibility") === "token" && (
										<FormField
											control={form.control}
											name="minTokens"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Minimum Tokens Required</FormLabel>
													<FormControl>
														<Input
															type="number"
															min="0"
															placeholder="0"
															{...field}
															onChange={(e) =>
																field.onChange(
																	Number.parseInt(e.target.value) || 0,
																)
															}
														/>
													</FormControl>
													<FormDescription>
														Minimum token balance required to participate
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									)}
								</CardContent>
							</Card>

							<div className="flex justify-between">
								<Button variant="outline" type="button">
									Save as Draft
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
				onClose={() => setShowDialog(false)}
				onConfirm={handleConfirmSubmission}
				isSubmitting={isSubmitting}
				proposal={watchedValues}
			/>
		</div>
	);
};

export default CreateProposalPage;
