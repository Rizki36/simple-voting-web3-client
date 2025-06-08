import ConnectButton from "./ConnectButton";

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

			<h3 className="text-xl font-medium mb-1">Decentralized Governance</h3>
			<p className="text-sm text-slate-400 mb-6">
				Participate in transparent blockchain voting and help shape collective
				decisions through secure, verifiable proposals
			</p>

			<ConnectButton />
		</div>
	);
};

export default ConnectWallet;
