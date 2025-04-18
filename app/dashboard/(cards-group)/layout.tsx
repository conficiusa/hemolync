import { StatCard } from "@/components/stat-card";
import React from "react";

const OverviewCardsLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<StatCard
					title='Total Blood'
					value='40,689Lt'
					change={8.5}
					changeType='increase'
					changeText='Up from yesterday'
				/>
				<StatCard
					title='Total Transferred'
					value='40,689Lt'
					change={4}
					changeType='decrease'
					changeText='Down from yesterday'
					changeColor='destructive'
				/>
				<StatCard
					title='Total Request'
					value='40,689Lt'
					change={8.5}
					changeType='increase'
					changeText='Up from yesterday'
					changeColor='success'
				/>
			</div>
			{children}
		</main>
	);
};

export default OverviewCardsLayout;
