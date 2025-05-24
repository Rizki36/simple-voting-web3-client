import { Button } from "@/components/ui/button";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

const ConnectButton = () => {
	const { open } = useAppKit();
	const { address, isConnected } = useAppKitAccount();

	return (
		<Button className="w-full mb-3" variant="outline" onClick={() => open()}>
			{isConnected && address ? (
				<span>
					{address.slice(0, 4)}...{address.slice(-4)} <br />
				</span>
			) : (
				"Connect with Wallet"
			)}
		</Button>
	);
};

export default ConnectButton;
