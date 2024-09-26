import {  LucideProps } from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

type ParamsType = {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>, 
  text: string, 
  description: string
}

export const InfoStep: React.FC<ParamsType> = ({icon: Icon, text, description}) => (
  <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
    <div className="bg-green-100 p-2 rounded-full">
      <Icon className="h-6 w-6 text-green-600"/>
    </div>
    <div>
      <h3 className="font-semibold text-gray-800">{text}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
)