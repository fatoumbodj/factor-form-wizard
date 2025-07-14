
import { Building, Users, FileText, Settings, Calculator, Handshake, Zap, Percent, Package, ChevronDown, FolderOpen } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Tiers",
    icon: Users,
    url: "/tiers",
    color: "text-blue-500",
  },
  {
    title: "Propositions",
    icon: Calculator,
    url: "/propositions",
    color: "text-orange-500",
  },
  {
    title: "Contrats",  
    icon: FileText,
    url: "/contrats",
    color: "text-green-500",
  },
  {
    title: "Matériel",
    icon: Package,
    url: "/materiel",
    color: "text-cyan-500",
  },
  {
    title: "Conventions",
    icon: Handshake,
    url: "/conventions",
    color: "text-purple-500",
  },
  {
    title: "Dossier de crédit",
    icon: FolderOpen,
    url: "/dossier-credit",
    color: "text-teal-500",
  },
];

const configurationItems = [
  {
    title: "Campagnes",
    icon: Zap,
    url: "/campagnes",
    color: "text-red-500",
  },
  {
    title: "Conventions",
    icon: Handshake,
    url: "/conventions",
    color: "text-purple-500",
  },
  {
    title: "Barème",
    icon: Percent,
    url: "/bareme",
    color: "text-indigo-500",
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground">CreditBail</h2>
            <p className="text-sm text-muted-foreground">Pro</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="pt-8">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover-scale">
                    <a href={item.url} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-all duration-200 group">
                      <div className="p-2 bg-accent/30 rounded-md group-hover:bg-accent/60 transition-colors">
                        <item.icon className={`h-5 w-5 ${item.color} group-hover:scale-110 transition-transform`} />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-accent-foreground">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Configuration avec sous-menu */}
              <Collapsible>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="hover-scale">
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-all duration-200 group w-full">
                        <div className="p-2 bg-accent/30 rounded-md group-hover:bg-accent/60 transition-colors">
                          <Settings className="h-5 w-5 text-gray-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="font-medium text-foreground group-hover:text-accent-foreground flex-1">Configuration</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-6 mt-2 space-y-1">
                      {configurationItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url} className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/30 transition-colors group">
                              <subItem.icon className={`h-4 w-4 ${subItem.color}`} />
                              <span className="text-sm font-medium text-foreground">{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
