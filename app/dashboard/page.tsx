export default function HomeDashboard() {
	return (
		<>
			<div className="bg-linear-to-r from-[#630034] to-[#7c0041]">
				<div className="flex flex-col gap-10 p-5 items-center justify-center">
					<iframe title="Sample Data" width="1140" height="541.25"
						src="https://app.powerbi.com/reportEmbed?reportId=aefc961c-01be-4df2-8a20-0bc8dc687d6a&autoAuth=true&ctid=fdd345f9-103a-4dcf-8685-4bde04046f0c"
						allowFullScreen={true}></iframe>
				</div>
			</div>
		</>
	)
}