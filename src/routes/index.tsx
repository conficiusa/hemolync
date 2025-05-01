import { createFileRoute } from '@tanstack/react-router'

import { Button } from "@/components/ui/button";
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
  
})

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-center bg-white p-4'>
			<h1 className='text-8xl'>Welcome to HemoLync </h1>
			<div className='flex gap-10 mt-10'>
				<Button className='w-28' asChild>
					<Link to={"/auth/login"}>Login</Link>
				</Button>
				<Button>
					<Link to={"/dashboard"}>Dashboard</Link>
				</Button>
			</div>
		</main>
	);
}

