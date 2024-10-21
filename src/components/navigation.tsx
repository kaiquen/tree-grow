import { Home, Medal, Trophy } from "lucide-react";

type NavigationProps = {
  activeSection: string,
  setActiveSection: (section: string) => void;
}
export const Navigation = ({activeSection, setActiveSection}:NavigationProps) => {
  const navItems = [
    {label: "Home", icon: <Home/>, section: "home"},
    {label: "Conquistas", icon: <Trophy/>, section: "achievements"},
    {label: "Classificações", icon: <Medal/>, section: "ratings"}
  ]

  return (
    <nav className="w-full flex self-end justify-between gap-6 px-6 py-2 text-zinc-300">
      {navItems.map(item => (
        <div 
          key={item.section}
          className={`flex flex-col items-center flex-1 cursor-pointer ${activeSection === item.section && "text-green-400"}`}
          onClick={() => setActiveSection(item.section)}
        >
          {item.icon}
          <p className="text-sm">{item.label}</p>
        </div>
      ))}  
    </nav>
  );
}