import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/authentication";
import Link from "next/link";
import Image from "next/image";

const drawerWidth = 240;

const AdminSidebar = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { text: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { text: "Products", href: "/admin/products", icon: Package },
    { text: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { text: "Users", href: "/admin/users", icon: Users },
    { text: "Site Content", href: "/admin/site-content", icon: FileText },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Top Logo */}
      <div className="flex justify-center items-center mt-6 mb-4">
        <Link href="/">
          <Image
            src="/landing-page/oven-and-wheat-no-tagline.png"
            alt="Bakery Brand"
            width={180}
            height={180 / 1.59}
            className="object-contain"
          />
        </Link>
      </div>

      {/* Menu Items */}
      <List>
        {menuItems.map(({ text, href, icon: Icon }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component={Link} href={href}>
              <Icon className="w-5 h-5 text-gray-700 mr-3" />
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Spacer to push logout to bottom */}
      <div className="flex-grow" />

      {/* Logout */}
      <ListItem disablePadding>
        <ListItemButton onClick={handleLogout}>
          <ListItemText
            primary="Log out"
            primaryTypographyProps={{ color: "text.primary" }}
          />
          <LogOut className="w-5 h-5 text-gray-700" />
        </ListItemButton>
      </ListItem>
    </Drawer>
  );
};

export default AdminSidebar;
