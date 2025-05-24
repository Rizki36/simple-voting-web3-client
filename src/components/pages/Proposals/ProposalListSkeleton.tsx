import { Skeleton } from "@/components/ui/skeleton";

type ProposalListSkeletonProps = {
	count: number;
};

const ProposalListSkeleton = ({ count }: ProposalListSkeletonProps) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{Array(count)
				.fill(0)
				.map((_, i) => (
					<div key={i} className="bg-slate-800 rounded-lg p-5">
						<div className="flex justify-between items-start mb-3">
							<Skeleton className="h-6 w-16 rounded-full" />
							<Skeleton className="h-4 w-28" />
						</div>

						<Skeleton className="h-6 w-3/4 mb-2" />
						<Skeleton className="h-4 w-full mb-1" />
						<Skeleton className="h-4 w-2/3 mb-4" />

						<Skeleton className="h-4 w-full mb-1" />
						<Skeleton className="h-2 w-full mb-4" />

						<div className="flex justify-between items-center">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-28" />
						</div>
					</div>
				))}
		</div>
	);
};

export default ProposalListSkeleton;
