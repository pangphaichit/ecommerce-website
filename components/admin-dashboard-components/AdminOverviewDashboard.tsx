import { useState } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  DollarSign,
  Users,
  Star,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  ChevronDown,
  Package,
} from "lucide-react";
import Badge from "@/components/ui/Badge";

type StatusType = "Completed" | "Processing" | "Shipped" | "Cancelled";
type StatusVariant =
  | "success"
  | "warning"
  | "secondary"
  | "destructive"
  | "outline";

interface StatItem {
  id: number;
  title: string;
  value: string;
  change: string;
  isPositive: boolean | null;
}

interface OrderItem {
  id: string;
  customer: string;
  customerAvatar: string;
  status: StatusType;
  statusColor: string;
  amount: string;
  date: string;
}

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  stockStatus: string;
  statusColor: StatusVariant;
  image: string;
}

// Mock data for stats
const statsData: StatItem[] = [
  {
    id: 1,
    title: "Total Orders",
    value: "1,245",
    change: "-15%",
    isPositive: false,
  },
  {
    id: 2,
    title: "Total Sales",
    value: "$48,574",
    change: "+8%",
    isPositive: true,
  },
  {
    id: 3,
    title: "Total Customers",
    value: "2,845",
    change: "+12%",
    isPositive: true,
  },
  {
    id: 4,
    title: "Total Reviews",
    value: "20",
    change: "+5%",
    isPositive: true,
  },
  {
    id: 5,
    title: "Total Complains",
    value: "5",
    change: "+1%",
    isPositive: true,
  },
];

// Mock data for recent orders
const recentOrdersData: OrderItem[] = [
  {
    id: "#ORD-1035",
    customer: "Alice Baker",
    customerAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "Completed",
    statusColor: "success",
    amount: "$78.00",
    date: "2023-05-12",
  },
  {
    id: "#ORD-1034",
    customer: "Bob Crumb",
    customerAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
    status: "Processing",
    statusColor: "warning",
    amount: "$35.50",
    date: "2023-05-11",
  },
  {
    id: "#ORD-1033",
    customer: "Cara Frost",
    customerAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
    status: "Shipped",
    statusColor: "secondary",
    amount: "$59.99",
    date: "2023-05-10",
  },
  {
    id: "#ORD-1032",
    customer: "David Miller",
    customerAvatar: "https://randomuser.me/api/portraits/women/45.jpg",
    status: "Completed",
    statusColor: "success",
    amount: "$129.50",
    date: "2023-05-09",
  },
  {
    id: "#ORD-1031",
    customer: "Emma Wilson",
    customerAvatar: "https://randomuser.me/api/portraits/women/20.jpg",
    status: "Cancelled",
    statusColor: "warning",
    amount: "$89.99",
    date: "2023-05-08",
  },
];

const weeklySalesData = [1250, 980, 1750, 1320, 1600, 850, 1450];
const monthlySalesData = [4200, 3800, 5500, 4100, 4800, 3200, 4900];

// Mock data for inventory
const inventoryData: InventoryItem[] = [
  {
    id: "BAK-001",
    name: "Chocolate Croissant",
    stock: 5,
    stockStatus: "Low Stock",
    statusColor: "destructive",
    image: "/placeholder.svg?height=140&width=140",
  },
  {
    id: "BAK-002",
    name: "Vanilla Eclair",
    stock: 18,
    stockStatus: "Medium Stock",
    statusColor: "warning",
    image: "/placeholder.svg?height=140&width=140",
  },
  {
    id: "BAK-003",
    name: "Almond Macarons",
    stock: 75,
    stockStatus: "In Stock",
    statusColor: "success",
    image: "/placeholder.svg?height=140&width=140",
  },
  {
    id: "BAK-004",
    name: "Blueberry Muffins",
    stock: 42,
    stockStatus: "In Stock",
    statusColor: "success",
    image: "/placeholder.svg?height=140&width=140",
  },
];

const AdminOverviewDashboard = () => {
  const [timeRange, setTimeRange] = useState("7");
  const [analyticsView, setAnalyticsView] = useState("weekly");
  const [orderSort, setOrderSort] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter orders based on status
  const filteredOrders =
    statusFilter === "all"
      ? recentOrdersData
      : recentOrdersData.filter(
          (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
        );

  // Sort orders based on selected sort option
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (orderSort === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (orderSort === "oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (orderSort === "highest") {
      return (
        Number.parseFloat(b.amount.replace("$", "")) -
        Number.parseFloat(a.amount.replace("$", ""))
      );
    } else if (orderSort === "lowest") {
      return (
        Number.parseFloat(a.amount.replace("$", "")) -
        Number.parseFloat(b.amount.replace("$", ""))
      );
    }
    return 0;
  });

  // Helper function to map status to appropriate badge variant
  const getStatusVariant = (status: StatusType): StatusVariant => {
    switch (status) {
      case "Completed":
        return "success";
      case "Processing":
        return "warning";
      case "Shipped":
        return "secondary";
      case "Cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 flex-1 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-500 mt-2">
            Welcome back! Here's what's happening with Oven & Wheat today.
          </p>
        </div>
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 pr-8 rounded-md text-sm cursor-pointer bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="month">This month</option>
            <option value="year">This year</option>
          </select>
          {/* Custom arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {statsData.map((stat) => {
            let IconComponent;
            let iconBg = "";
            let iconColor = "";

            switch (stat.title) {
              case "Total Orders":
                IconComponent = ShoppingCart;
                iconBg = "bg-blue-100";
                iconColor = "text-blue-600";
                break;
              case "Total Sales":
                IconComponent = DollarSign;
                iconBg = "bg-green-100";
                iconColor = "text-green-600";
                break;
              case "Total Customers":
                IconComponent = Users;
                iconBg = "bg-purple-100";
                iconColor = "text-purple-600";
                break;
              case "Total Reviews":
                IconComponent = Star;
                iconBg = "bg-yellow-100";
                iconColor = "text-yellow-600";
                break;
              case "Total Complains":
                IconComponent = AlertCircle;
                iconBg = "bg-red-100";
                iconColor = "text-red-600";
                break;
              default:
                IconComponent = Users;
                iconBg = "bg-gray-100";
                iconColor = "text-gray-600";
            }

            return (
              <div
                key={stat.id}
                className="bg-white rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 shadow-sm cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${iconBg}`}>
                    <IconComponent className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <div className="text-right">
                    <h2 className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </h2>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  {stat.isPositive === true && (
                    <>
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">
                        {stat.change}
                      </span>
                    </>
                  )}
                  {stat.isPositive === false && (
                    <>
                      <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                      <span className="text-red-500 font-medium">
                        {stat.change}
                      </span>
                    </>
                  )}
                  {stat.isPositive === null && (
                    <span className="text-gray-400 font-medium">
                      {stat.change}
                    </span>
                  )}
                  <span className="ml-2">from last month</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4  gap-4">
            <h3 className="text-lg font-bold">Recent Orders</h3>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search orders"
                  className="pl-8 w-full sm:w-[200px] bg-gray-50 rounded-md py-1.5 px-3 text-sm focus:outline-none
      focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-black"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`
   cursor-pointer appearance-none w-full pl-3 pr-8 py-2 bg-gray-50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent
      text-${statusFilter === "completed" ? "green-600" : ""}
      text-${statusFilter === "processing" ? "yellow-600" : ""}
      text-${statusFilter === "shipped" ? "gray-700" : ""}
      text-${statusFilter === "cancelled" ? "red-600" : ""}
    `}
                >
                  <option value="all" className="text-black">
                    All Status
                  </option>
                  <option value="completed" className="text-green-600">
                    Completed
                  </option>
                  <option value="processing" className="text-yellow-600">
                    Processing
                  </option>
                  <option value="shipped" className="text-gray-700">
                    Shipped
                  </option>
                  <option value="cancelled" className="text-red-600">
                    Cancelled
                  </option>
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={orderSort}
                  onChange={(e) => setOrderSort(e.target.value)}
                  className="
      cursor-pointer appearance-none w-full pl-3 pr-8 py-2 bg-gray-50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-black
    "
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Amount</option>
                  <option value="lowest">Lowest Amount</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>

              <button className="bg-yellow-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-yellow-700 whitespace-nowrap cursor-pointer">
                View All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <Image
                          src={order.customerAvatar || "/placeholder.svg"}
                          alt={order.customer}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full mr-2"
                        />
                        <span>{order.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      {order.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Analytics */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h3 className="text-lg font-bold">Sales Analytics</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setAnalyticsView("weekly")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer ${
                  analyticsView === "weekly"
                    ? "bg-yellow-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setAnalyticsView("monthly")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer ${
                  analyticsView === "monthly"
                    ? "bg-yellow-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 h-[300px] flex flex-col justify-between">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">
                  {analyticsView === "weekly"
                    ? "Weekly Sales"
                    : "Monthly Sales"}
                </span>
                <span className="text-sm font-bold">
                  Total: $
                  {analyticsView === "weekly"
                    ? weeklySalesData
                        .reduce((sum, value) => sum + value, 0)
                        .toLocaleString()
                    : monthlySalesData
                        .reduce((sum, value) => sum + value, 0)
                        .toLocaleString()}
                </span>
              </div>

              {/* Chart bars */}
              <div className="flex items-end h-[200px] justify-between">
                {(analyticsView === "weekly"
                  ? weeklySalesData
                  : monthlySalesData
                ).map((value, index) => {
                  const maxValue = Math.max(
                    ...(analyticsView === "weekly"
                      ? weeklySalesData
                      : monthlySalesData)
                  );
                  const heightPercentage = (value / maxValue) * 180;

                  return (
                    <div
                      key={index}
                      className="w-[12%] bg-blue-500 rounded-t-sm relative group transition-all hover:bg-blue-600"
                      style={{ height: `${heightPercentage}px` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        ${value}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-axis labels */}
              <div className="flex justify-between mt-2">
                {analyticsView === "weekly"
                  ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day, index) => (
                        <span key={index} className="text-xs text-gray-500">
                          {day}
                        </span>
                      )
                    )
                  : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map(
                      (month, index) => (
                        <span key={index} className="text-xs text-gray-500">
                          {month}
                        </span>
                      )
                    )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewDashboard;
