import { useState } from "react";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  ChevronDown,
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
  isPositive: boolean;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
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
    icon: ShoppingCart,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    title: "Total Sales",
    value: "$48,574",
    change: "+8%",
    isPositive: true,
    icon: DollarSign,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: 3,
    title: "Total Customers",
    value: "2,845",
    change: "+12%",
    isPositive: true,
    icon: Users,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

// Mock data for recent orders
const recentOrdersData: OrderItem[] = [
  {
    id: "#ORD-1035",
    customer: "Alice Baker",
    customerAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=JohnDoe",
    status: "Completed",
    statusColor: "success",
    amount: "$78.00",
    date: "2023-05-12",
  },
  {
    id: "#ORD-1034",
    customer: "Bob Crumb",
    customerAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=JohnDoe",
    status: "Processing",
    statusColor: "warning",
    amount: "$35.50",
    date: "2023-05-11",
  },
  {
    id: "#ORD-1033",
    customer: "Cara Frost",
    customerAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=JohnDoe",
    status: "Shipped",
    statusColor: "secondary",
    amount: "$59.99",
    date: "2023-05-10",
  },
  {
    id: "#ORD-1032",
    customer: "David Miller",
    customerAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=JohnDoe",
    status: "Completed",
    statusColor: "success",
    amount: "$129.50",
    date: "2023-05-09",
  },
  {
    id: "#ORD-1031",
    customer: "Emma Wilson",
    customerAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=JohnDoe",
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
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm cursor-pointer"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="month">This month</option>
          <option value="year">This year</option>
        </select>
      </div>

      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statsData.map((stat) => (
            <div key={stat.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.iconBg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-500">
                    {stat.title}
                  </h2>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <div className="flex items-center text-sm">
                    {stat.isPositive ? (
                      <ArrowUpRight className="w-4 h-4 ml-1 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 ml-1 text-red-500" />
                    )}
                    <span
                      className={`${
                        stat.isPositive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-gray-400 ml-1">from last month</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
      focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-black cursor-pointer"
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
                        <img
                          src={order.customerAvatar || "/placeholder.svg"}
                          alt={order.customer}
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

        {/* Product Inventory */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <div>
              <h3 className="text-lg font-bold">Bakery Inventory</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 cursor-pointer">
                Export
              </button>
              <button className="bg-yellow-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-yellow-700 cursor-pointer">
                Add Product
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {inventoryData.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:translate-y-[-4px] hover:shadow-md"
                >
                  <div className="h-[140px] bg-gray-100 flex items-center justify-center">
                    <Package size={48} className="text-gray-400" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      SKU: {product.id}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant={product.statusColor}>
                        {product.stockStatus}: {product.stock}
                      </Badge>
                      <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                        <Filter className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewDashboard;
