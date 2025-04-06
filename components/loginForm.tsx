"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function LoginForm() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const selectRole = (role: string) => {
    setSelectedRole(role)
    setIsDropdownOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="role" className="block text-sm font-medium text-[hsla(217,23%,27%,1)]">
          Role
        </label>
        <div className="relative">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-md border border-[#d0d5dd] bg-white px-4 py-2.5 text-left text-[#667085] focus:outline-none"
            onClick={toggleDropdown}
          >
            {selectedRole || "Select"}
            <ChevronDown className="h-5 w-5 text-[#98a2b3]" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-6 z-10 w-[240px] rounded-md bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
              <div className="py-1">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-[#f2f4f7]"
                  onClick={() => selectRole("Administrator")}
                >
                  Administrator
                  <span>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${selectedRole === "Administrator" ? "bg-[#85143e]" : "border border-[#d0d5dd]"}`}
                    >
                      {selectedRole === "Administrator" && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
                    </div>
                  </span>
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-[#f2f4f7]"
                  onClick={() => selectRole("Blood bank incharge")}
                >
                  Blood bank incharge
                  <span>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${selectedRole === "Blood bank incharge" ? "bg-[#85143e]" : "border border-[#d0d5dd]"}`}
                    >
                      {selectedRole === "Blood bank incharge" && (
                        <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                      )}
                    </div>
                  </span>
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-[#f2f4f7]"
                  onClick={() => selectRole("Staff")}
                >
                  Staff
                  <span>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${selectedRole === "Staff" ? "bg-[#85143e]" : "border border-[#d0d5dd]"}`}
                    >
                      {selectedRole === "Staff" && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
                    </div>
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-[hsla(217,23%,27%,1)]">
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter email"
          className="w-full rounded-md border border-[#d0d5dd] px-4 py-2.5 text-[#667085] focus:border-[#85143e] focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-[hsla(217,23%,27%,1)]">
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Enter Password"
          className="w-full rounded-md border border-[#d0d5dd] px-4 py-2.5 text-[#667085] focus:border-[#85143e] focus:outline-none"
        />
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-md bg-[#85143e] py-3 text-center text-white hover:bg-[#611035] focus:outline-none"
      >
        Login
      </button>
    </div>
  )
}

