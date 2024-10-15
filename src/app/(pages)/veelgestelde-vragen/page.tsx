import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Faq() {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">BESTELLEN EN LEVERING</h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="font-light">
            Wat zijn de minimale bestelhoeveelheden voor franco levering?
          </AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal list-inside">
              <li className="m-2">
                Voor bezorging buiten Den Haag: 1200 euro ex. BTW
              </li>
              <li className="m-2">
                Voor bezorging binnen Den Haag: 1000 euro ex. BTW
              </li>
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}