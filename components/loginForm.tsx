"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import SelectDropdown from "./selectDropdown";

export default function LoginForm() {
	const [selectedRole, setSelectedRole] = useState<string | null>(null);
	return (
		<div className='space-y-4'>
			<div className='space-y-2'>
				<Label
					htmlFor='role'
					className='block text-sm font-medium text-[hsla(217,23%,27%,1)]'
				>
					Role
				</Label>
				<SelectDropdown
					selected={selectedRole}
					setSelected={setSelectedRole}
					placeholder='Select Role'
				/>
			</div>
			<div className='space-y-2'>
				<Label
					htmlFor='email'
					className='block text-sm font-medium text-[hsla(217,23%,27%,1)]'
				>
					Email
				</Label>
				<input
					type='email'
					id='email'
					placeholder='Enter email'
					className='w-full rounded-md border border-[#d0d5dd] px-4 py-2.5 text-[#667085] focus:border-[#85143e] focus:outline-none'
				/>
			</div>

			<div className='space-y-2'>
				<Label
					htmlFor='password'
					className='block text-sm font-medium text-[hsla(217,23%,27%,1)]'
				>
					Password
				</Label>

				<input
					type='password'
					id='password'
					placeholder='Enter Password'
					className='w-full rounded-md border border-[#d0d5dd] px-4 py-2.5 text-[#667085] focus:border-[#85143e] focus:outline-none'
				/>
			</div>

			<Button
				size={"xl"}
				type='button'
				className='mt-6 w-full  rounded-md py-3 text-center text-white hover:bg-[#611035] focus:outline-none'
			>
				Login
			</Button>
		</div>
	);
}
