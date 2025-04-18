import { cn } from "@/lib/utils";

export default function HemoLyncLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative w-[203px] h-[59px] flex items-center", className)}
    >
      <div className="absolute w-[203px] h-[59px] top-0 left-1.5 bg-[#f73131] rounded-[101.64px/29.6px]" />
      <div className="absolute w-[185px] h-[54px] top-1 left-0 bg-white rounded-[92.53px/26.95px]" />
      <div className="absolute top-1 left-4 font-['Jura',Helvetica] font-normal text-transparent text-[31.5px] leading-[48.9px] whitespace-nowrap">
        <span className="font-bold text-[#f63131] tracking-[0]">Hemo</span>
        <span className="font-bold text-[#289cfc] tracking-[0]">Lync</span>
      </div>
    </div>
  );
}
