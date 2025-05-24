import { Button } from "@/components/ui/button";

const ConnectWallet = () => {
	return (
		<div className="bg-slate-800 rounded-lg p-5 mb-6">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
						<span className="text-xs font-bold text-white">V3</span>
					</div>
					<span className="font-semibold">
						VoteChain<sup>®</sup>
					</span>
				</div>
				<span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">
					New
				</span>
			</div>

			<h3 className="text-xl font-medium mb-1">Liquid Voting Portfolio</h3>
			<p className="text-sm text-slate-400 mb-6">
				Apply AI algorithms to help you make smarter investments with Ethereum
				Liquid Staking
			</p>

			<Button className="w-full mb-3" variant="outline">
				Connect with Wallet
			</Button>

			<Button className="w-full" variant="ghost">
				Enter a Wallet Address
			</Button>
		</div>
	);
};

export default ConnectWallet;
