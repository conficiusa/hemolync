import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { memo } from 'react'

const SettingsFaq = memo(() => {
  const faqItems = [
    {
      id: 'item-1',
      question: 'What is Hemolync-BDM',
      answer:
        'Unlock the power of AI-driven cloud solutions with Figurative! Discover how our innovative platform, Reason AI, empowers developers to build cutting-edge applications Unlock the power of AI-driven',
      defaultOpen: true,
    },
    {
      id: 'item-2',
      question: 'What is Acs Provisioning plateform',
      answer: '',
      defaultOpen: false,
    },
    {
      id: 'item-3',
      question: 'What is Acs Provisioning plateform',
      answer: '',
      defaultOpen: false,
    },
    {
      id: 'item-4',
      question: 'What is Acs Provisioning plateform',
      answer: '',
      defaultOpen: false,
    },
  ]

  return (
    <div>
      <Accordion
        type="single"
        collapsible
        defaultValue="item-1"
        className="flex flex-col gap-4"
      >
        {faqItems.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="border-2 border-[#eaecf0] rounded-3xl px-6 py-4 data-[state=open]:border-[#eaecf0] data-[state=closed]:border-[#eaecf0]"
          >
            <AccordionTrigger className="hover:no-underline text-left [&[data-state=open]>svg]:rotate-180">
              <div className="flex flex-col items-start justify-center gap-2 flex-1">
                <div className="[font-family:'Inter',Helvetica] font-bold text-gray-800 text-base tracking-[0] leading-7 whitespace-nowrap">
                  {item.question}
                </div>
              </div>
            </AccordionTrigger>
            {item.answer && (
              <AccordionContent className="pb-0">
                <div className="[font-family:'Inter',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-6 mt-2">
                  {item.answer}
                </div>
              </AccordionContent>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
})
SettingsFaq.displayName = 'SettingsFaq'
export default SettingsFaq

