const InvestmentPeriod = () => {
	return (
		<div className="bg-slate-800 rounded-lg p-5">
			<h3 className="text-lg font-medium mb-4">Investment Period</h3>
			<div className="flex justify-between items-center mb-2">
				<div className="text-sm text-slate-400">
					Contribution Period (Month)
				</div>
				<div className="bg-slate-700 rounded-full px-2 py-0.5 text-xs">
					6 Month
				</div>
			</div>

			<div className="h-2 bg-slate-700 rounded-full mb-6 overflow-hidden relative">
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-slate-800"></div>
				<div className="h-full bg-blue-500" style={{ width: "50%" }}></div>
			</div>

			<div className="flex justify-between items-center">
				<div className="text-sm text-slate-400">
					Contribution Period (Month)
				</div>
				<div className="bg-slate-700 rounded-full px-2 py-0.5 text-xs">
					4 Month
				</div>
			</div>

			<div className="h-2 bg-slate-700 rounded-full mt-2 mb-2 overflow-hidden relative">
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-slate-800"></div>
				<div className="h-full bg-blue-500" style={{ width: "40%" }}></div>
			</div>
		</div>
	);
};

export default InvestmentPeriod;
