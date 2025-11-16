import {
  CogIcon,
  DollarSignIcon,
  HomeIcon,
  LayoutTemplateIcon,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Dashboard",
      href: "/app",
      icon: HomeIcon,
    },
    {
      title: "Settings",
      href: "/app/settings",
      icon: CogIcon,
    },
    {
      title: "Templates",
      href: "/app/templates",
      icon: LayoutTemplateIcon,
    },
    {
      title: "Gerar Fatura",
      href: "/app/billing",
      icon: DollarSignIcon,
    },
  ],
};
