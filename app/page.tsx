import LoginForm from "@/components/loginForm";
import HemoLyncLogo from "@/components/logo";

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-center bg-white p-4'>
			<div className='w-full max-w-md'>
				<div className='flex flex-col items-start'>
					<HemoLyncLogo />
					<h1 className='text-left text-2xl font-semibold text-[#1d2939] mb-6'>
						Welcome to HemoLync
					</h1>
				</div>
				<LoginForm />
			</div>
		</main>
	);
}
