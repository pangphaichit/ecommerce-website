import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import {
  Package,
  Search,
  Plus,
  Trash,
  Check,
  X,
  Gift,
  Heart,
  Egg,
  Sparkles,
  Ghost,
  Flower,
  Sun,
  Filter,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DialogComponents from "@/components/ui/Dialog";
import InputAdmin from "@/components/ui/InputAdmin";
import Checkbox from "@/components/ui/Checkbox";
import Select from "@/components/ui/Select";
import TextareaAdmin from "@/components/ui/TextareaAdmin";
import SkeletonAdmin from "@/components/ui/SkeletonAdmin";
import EditImageUpload from "./EditImageUpload";
import CustomAlert from "@/components/ui/CustomAlert";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Pagination from "@/components/ui/Pagination";
import { AlertItem } from "@/types/ui";

interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number | null;
  is_available: boolean;
  category_id: number | null;
  size: string;
  ingredients: string;
  allergens: string;
  nutritional_info: string;
  seasonal: string;
  collection: string;
  stock_quantity: number;
  min_order_quantity: number;
  image_url: string;
  slug: string;
  image_file?: File;
}

interface ValidationErrors {
  name?: string;
  price?: string;
  description?: string;
  stock_quantity?: string;
  min_order_quantity?: string;
  category_id?: string;
  slug?: string;
  [key: string]: string | undefined;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const AdminProductsDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: null,
    is_available: true,
    category_id: null,
    size: "",
    ingredients: "",
    allergens: "",
    nutritional_info: "",
    seasonal: "",
    collection: "",
    stock_quantity: 1,
    min_order_quantity: 1,
    image_url: "",
  });

  const [formErrors, setFormErrors] = useState<ValidationErrors>({});

  const [editFormErrors, setEditFormErrors] = useState<ValidationErrors>({});

  const [newProductImage, setNewProductImage] = useState<File | null>(null);
  const [editProductImage, setEditProductImage] = useState<File | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for stacked alerts
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } =
    DialogComponents;

  const getCacheBustedImageUrl = (url: string) => {
    if (!url) return "";
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}t=${Date.now()}`;
  };

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };

      // Add conditional filters
      if (submittedSearch) params.search = submittedSearch;
      if (categoryFilter !== "all") params.category_id = categoryFilter;
      if (availabilityFilter === "available") params.is_available = "true";
      if (availabilityFilter === "unavailable") params.is_available = "false";

      const response = await axios.get("/api/products", { params });

      setProducts(response.data.product);
      setPagination(response.data.pagination);
      console.log("Products fetched:", response.data.product);
      console.log("Pagination:", response.data.pagination);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when search, filter, or pagination changes
  useEffect(() => {
    fetchProducts();
  }, [
    submittedSearch,
    categoryFilter,
    availabilityFilter,
    pagination.page,
    pagination.limit,
  ]);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/products/categories");
        setCategories(res.data.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    fetchCategories();
  }, []);

  const validateProductForm = (
    product: Partial<Product>,
    isEditMode = false
  ): ValidationErrors => {
    console.log("Validating product:", product);
    const errors: ValidationErrors = {};

    // Image validation
    if (!isEditMode && !newProductImage) {
      errors.image_url = "Product image is required";
    } else if (
      newProductImage &&
      typeof newProductImage === "object" &&
      newProductImage instanceof File
    ) {
      const validImageTypes = ["image/jpeg", "image/png"];
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

      if (!validImageTypes.includes(newProductImage.type)) {
        errors.image_url = "Image must be in JPEG or PNG format";
      } else if (newProductImage.size > maxSizeInBytes) {
        errors.image_url = "Image size must be less than 5MB";
      }
    }

    // Name validation - Required field with sanitization
    if (!product.name || product.name.trim() === "") {
      errors.name = "Product name is required";
    } else {
      const sanitizedName = product.name.trim();

      if (sanitizedName.length < 3) {
        errors.name = "Product name must be at least 3 characters";
      } else if (sanitizedName.length > 30) {
        errors.name = "Product name must be less than 50 characters";
      } else if (/[<>{}]/g.test(sanitizedName)) {
        errors.name = "Product name contains invalid characters";
      }
    }

    // Price validation with proper decimal handling
    if (product.price === undefined || product.price === null) {
      errors.price = "Price is required";
    } else {
      const numPrice = Number(product.price);

      if (isNaN(numPrice)) {
        errors.price = "Price must be a valid number";
      } else if (numPrice <= 0) {
        errors.price = "Price must be greater than 0";
      } else if (numPrice > 9999999.99) {
        errors.price = "Price cannot exceed 9,999,999.99";
      } else if (!/^\d+(\.\d{1,2})?$/.test(String(product.price))) {
        errors.price = "Price must have at most 2 decimal places";
      }
    }

    // Stock quantity validation
    if (
      product.stock_quantity === undefined ||
      product.stock_quantity === null ||
      product.stock_quantity === 0
    ) {
      errors.stock_quantity = "Stock quantity is required";
    } else {
      const stockQty = Number(product.stock_quantity);

      if (isNaN(stockQty)) {
        errors.stock_quantity = "Stock quantity must be a valid number";
      } else if (!Number.isInteger(stockQty)) {
        errors.stock_quantity = "Stock quantity must be a whole number";
      } else if (stockQty < 0) {
        errors.stock_quantity = "Stock quantity cannot be negative";
      } else if (stockQty > 1000000) {
        errors.stock_quantity = "Stock quantity exceeds maximum allowed value";
      }
    }

    // Minimum order quantity validation
    if (
      product.min_order_quantity === undefined ||
      product.min_order_quantity === null
    ) {
      errors.min_order_quantity = "Minimum order quantity is required";
    } else {
      const minOrderQty = Number(product.min_order_quantity);

      if (isNaN(minOrderQty)) {
        errors.min_order_quantity =
          "Minimum order quantity must be a valid number";
      } else if (!Number.isInteger(minOrderQty)) {
        errors.min_order_quantity =
          "Minimum order quantity must be a whole number";
      } else if (minOrderQty < 1) {
        errors.min_order_quantity = "Minimum order quantity must be at least 1";
      } else if (minOrderQty > Number(product.stock_quantity || 0)) {
        errors.min_order_quantity =
          "Minimum order quantity cannot exceed stock quantity";
      }
    }

    // Category validation
    if (!product.category_id) {
      errors.category_id = "Category is required";
    } else if (
      typeof product.category_id === "string" &&
      !Number.isInteger(Number(product.category_id))
    ) {
      errors.category_id = "Invalid category selection";
    }

    // Required text fields validation with sanitization
    const requiredTextFields: Array<{
      key: keyof Product;
      name: string;
      minLength?: number;
    }> = [
      { key: "description", name: "Description", minLength: 10 },
      { key: "ingredients", name: "Ingredients", minLength: 5 },
      { key: "allergens", name: "Allergens" }, // Make sure allergens are included
      { key: "nutritional_info", name: "Nutritional information" }, // Same for nutritional info
    ];

    requiredTextFields.forEach(({ key, name, minLength }) => {
      const value = product[key];
      console.log(`Validating field: ${name}, Value:`, value);

      // Ensure empty strings, null, and undefined are treated as missing values
      if (value === "" || value == null) {
        // Explicit check for empty string and null/undefined
        console.log(`Error: ${name} is required`); // Log error
        errors[key] = `${name} is required`;
      } else if (
        minLength &&
        typeof value === "string" &&
        value.trim().length < minLength
      ) {
        console.log(`Error: ${name} must be at least ${minLength} characters`);
        errors[key] = `${name} must be at least ${minLength} characters`;
      }
    });

    // Optional fields validation
    const optionalFields: Array<{
      key: keyof Product;
      name: string;
      maxLength: number;
    }> = [
      { key: "size", name: "Size", maxLength: 20 },
      { key: "collection", name: "Collection", maxLength: 30 },
      { key: "ingredients", name: "Ingredients", maxLength: 500 },
      { key: "allergens", name: "Allergens", maxLength: 500 },
      {
        key: "nutritional_info",
        name: "Nutritional information",
        maxLength: 500,
      },
      { key: "description", name: "Description", maxLength: 500 },
    ];

    optionalFields.forEach(({ key, name, maxLength }) => {
      const value = product[key];

      // Check if the field is not empty before applying max length validation
      if (value && typeof value === "string") {
        if (value.length > maxLength) {
          errors[key] = `${name} must be less than ${maxLength} characters`;
        } else if (/[<>{}]/g.test(value)) {
          errors[key] = `${name} contains invalid characters`;
        }
      }
    });

    // Seasonal ENUM validation with case-insensitive matching
    const validSeasonal = [
      "Christmas",
      "Valentine's",
      "Easter",
      "New Year",
      "Halloween",
      "Mother's Day",
      "Father's Day",
    ];

    if (product.seasonal) {
      const normalizedInput = product.seasonal.trim().toLowerCase();
      const matchedSeasonal = validSeasonal.find(
        (seasonal) => seasonal.toLowerCase() === normalizedInput
      );

      if (!matchedSeasonal) {
        errors.seasonal = `Seasonal must be one of: ${validSeasonal.join(
          ", "
        )}`;
      } else {
        // Auto-correct to the properly cased version
        product.seasonal = matchedSeasonal;
      }
    }

    return errors;
  };

  // Validation for Add Product form
  const validateAddProductForm = (): boolean => {
    const errors = validateProductForm(newProduct);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validation for Edit Product form
  const validateEditProductForm = () => {
    if (!currentProduct) {
      console.error("No product found for editing");
      return false;
    }
    const errors = validateProductForm(currentProduct, true);
    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add product
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before proceeding
    if (!validateAddProductForm()) {
      return; // Stop if validation fails
    }

    try {
      setLoading(true);

      const imageForm = new FormData();
      if (newProductImage) {
        imageForm.append("file", newProductImage);
      }

      const uploadResponse = await axios.post(
        "/api/admin/products/image",
        imageForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      const uploadedUrls = uploadResponse.data?.urls;
      if (!uploadedUrls || uploadedUrls.length === 0) {
        throw new Error("Image upload failed or returned no URL");
      }

      const imageUrl = uploadedUrls[0];

      const productResponse = await axios.post("/api/admin/products", {
        ...newProduct,
        image_url: imageUrl,
      });

      if (productResponse.status === 201) {
        showAlert("Product added successfully!", "success", "local");
        setIsAddDialogOpen(false);
        setNewProduct({
          name: "",
          description: "",
          price: null,
          is_available: true,
          category_id: null,
          size: "",
          ingredients: "",
          allergens: "",
          nutritional_info: "",
          seasonal: "",
          collection: "",
          stock_quantity: 1,
          min_order_quantity: 1,
          image_url: "",
        });
        setNewProductImage(null);
        setFormErrors({});
        fetchProducts();
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data?.error);
        const serverError = err.response?.data?.error || "";

        // Check for specific error messages and map them to form fields
        if (
          err.response?.data?.error?.includes("Product name already exists") ||
          err.response?.data?.error?.includes("name already exists")
        ) {
          setFormErrors((prev) => ({
            ...prev,
            name: err.response?.data?.error ?? "An unknown error occurred",
          }));
          return;
          // Don't show the alert for this specific error
        } else if (typeof err.response?.data?.errors === "object") {
          // Iterate over the keys in the errors object
          Object.keys(err.response?.data?.errors).forEach((key) => {
            // Set the form error for the current key
            setFormErrors((prev) => ({
              ...prev,
              [key]: err.response?.data?.errors[key].join(", "), // Join multiple errors if needed
            }));
          });
          // Show alert for other errors
          showAlert(
            "An error occurred while adding the product.",
            "error",
            "local"
          );
        } else {
          // Show alert for other errors
          showAlert(
            "An error occurred while adding the product.",
            "error",
            "local"
          );
        }

        setError(serverError || "An error occurred while adding the product.");
      } else if (err instanceof Error) {
        showAlert("err.message", "error", "local");

        setError(err.message);
      } else {
        showAlert(
          "An error occurred while adding the product.",
          "error",
          "local"
        );

        setError("An error occurred while adding the product.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentProduct) return;

    if (!validateEditProductForm()) {
      return;
    }

    try {
      setLoading(true);

      let imageUrl = currentProduct.image_url;

      if (editProductImage) {
        const imageForm = new FormData();
        imageForm.append("file", editProductImage);

        const uploadResponse = await axios.post(
          "/api/admin/products/image",
          imageForm,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        const uploadedUrls = uploadResponse.data?.urls;
        if (!uploadedUrls || uploadedUrls.length === 0) {
          throw new Error("Image upload failed or returned no URL");
        }

        imageUrl = uploadedUrls[0];
      }

      // Prepare updated product data
      const updatedProduct = {
        ...currentProduct,
        image_url: imageUrl,
        is_available: currentProduct.is_available ? "true" : "false",
      };

      console.log(
        "Sending updated product with image:",
        updatedProduct.image_url
      );

      const response = await axios.put(
        `/api/admin/products/${currentProduct.product_id}`,
        updatedProduct,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        showAlert("Product updated successfully!", "success", "local");

        setIsEditDialogOpen(false);
        setCurrentProduct(null);
        setEditProductImage(null);
        setEditFormErrors({});
        fetchProducts();
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data?.error);
        const serverError = err.response?.data?.error || "";

        // Specific slug error handling
        if (serverError.includes("A product with this name already exists")) {
          setEditFormErrors((prev) => ({
            ...prev,
            name: "A product with this name already exists.",
          }));
          return;
        }

        // Field-level errors
        if (typeof err.response?.data?.errors === "object") {
          const fieldErrors = err.response.data.errors;
          Object.keys(fieldErrors).forEach((key) => {
            const messages = fieldErrors[key];
            setEditFormErrors((prev) => ({
              ...prev,
              [key]: Array.isArray(messages)
                ? messages.join(", ")
                : String(messages || "Unknown error"),
            }));
          });

          // Show alert for other errors
          showAlert(
            serverError || "An error occurred while updating the product.",
            "error",
            "local"
          );
        } else {
          // Show alert for other errors
          showAlert(
            serverError || "An error occurred while updating the product.",
            "error",
            "local"
          );
        }

        setError(
          serverError || "An error occurred while updating the product."
        );
      } else if (err instanceof Error) {
        showAlert(err.message, "error", "local");

        setError(err.message);
      } else {
        showAlert(
          "An error occurred while updating the product.",
          "error",
          "local"
        );

        setError("An error occurred while updating the product.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear errors when dialogs are closed
  useEffect(() => {
    if (!isAddDialogOpen) {
      setFormErrors({});
    }
    if (!isEditDialogOpen) {
      setEditFormErrors({});
    }
  }, [isAddDialogOpen, isEditDialogOpen]);

  // deleting a product
  const handleDeleteProduct = async () => {
    if (!currentProduct) return;

    try {
      setLoading(true);

      // Send delete request
      const response = await axios.delete(
        `/api/admin/products/${currentProduct.product_id}`
      );

      // If successful, close dialog and refresh products
      if (response.status === 200) {
        setIsDeleteDialogOpen(false);
        setCurrentProduct(null);

        // Refresh products list
        fetchProducts();
        showAlert("Product deleted successfully.", "success", "local");
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred while deleting the product.";
      setError(message);
      showAlert(message, "error", "local");
    } finally {
      setLoading(false);
    }
  };

  //Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    try {
      setLoading(true);

      // Send bulk delete request
      const formattedProductIds = selectedProducts
        .map((id) => String(id))
        .filter((id) => id.length > 0);

      if (formattedProductIds.length === 0) {
        setError("No valid product IDs selected for deletion.");
        setLoading(false);
        return;
      }

      const response = await axios.post("/api/admin/products/bulk-delete", {
        productIds: formattedProductIds,
      });

      // If successful, reset selection and refresh products
      if (response.status === 200) {
        setSelectedProducts([]);
        setIsSelectionMode(false);

        // Refresh products list
        fetchProducts();
        showAlert(
          "Selected products deleted successfully.",
          "success",
          "local"
        );
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred while deleting the products.";
      setError(message);
      showAlert(message, "error", "local");
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({
        ...pagination,
        page: newPage,
      });
    }
  };

  const toggleProductSelection = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // Check if any filters are active
  const isFiltering =
    submittedSearch !== "" ||
    categoryFilter !== "all" ||
    availabilityFilter !== "all";

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product.product_id));
    }
  };

  const getStockStatusVariant = (
    quantity: number
  ): "success" | "warning" | "destructive" => {
    if (quantity > 10) return "success";
    if (quantity > 0) return "warning";
    return "destructive";
  };

  const getStockStatusText = (quantity: number): string => {
    if (quantity > 10) return "In Stock";
    if (quantity > 0) return "Low Stock";
    return "Out of Stock";
  };

  // Category options for select

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/products/categories");
        setCategories(res.data.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const categoryOptions = categories.map((category) => ({
    value: String(category.category_id),
    label: category.name,
  }));

  const categoryFilterOptions = [
    { value: "all", label: "All Categories" },
    ...categoryOptions,
  ];

  // Availability options for select
  const availabilityOptions = [
    { value: "all", label: "All Products" },
    { value: "available", label: "Available" },
    { value: "unavailable", label: "Out of Stock" },
  ];

  // Seasonal options for select
  const seasonalOptions = [
    { value: "Christmas", label: "Christmas" },
    { value: "Valentine's", label: "Valentine's" },
    { value: "Easter", label: "Easter" },
    { value: "New Year", label: "New Year" },
    { value: "Halloween", label: "Halloween" },
    { value: "Mother's Day", label: "Mother's Day" },
    { value: "Father's Day", label: "Father's Day" },
  ];

  const seasonalStyles: Record<
    string,
    { icon: React.ComponentType<{ size: number }>; bg: string }
  > = {
    Christmas: { icon: Gift, bg: "bg-red-600" },
    "Valentine's": { icon: Heart, bg: "bg-pink-500" },
    Easter: { icon: Egg, bg: "bg-purple-500" },
    "New Year": { icon: Sparkles, bg: "bg-yellow-500" },
    Halloween: { icon: Ghost, bg: "bg-orange-600" },
    "Mother's Day": { icon: Flower, bg: "bg-pink-400" },
    "Father's Day": { icon: Sun, bg: "bg-blue-600" },
  };

  const showAlert = (
    message: string,
    type: "success" | "error",
    scope: "local" | "global" = "local"
  ) => {
    if (scope === "local") {
      const id = Date.now() + Math.random();

      setAlerts((prev) => [{ id, message, type }, ...prev]);
    } else {
      console.warn("Global alert triggered:", message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 flex-1 bg-gray-50">
      {/* {loading ? (
        <div className="flex flex-col items-center justify-center h-full py-16">
          <div className="flex items-center gap-2">
            <LoadingSpinner className="h-6 w-6 animate-spin text-yellow-600 mr-2" />
            <span>Loading products...</span>
          </div>
        </div>
      ) : ( */}
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Products Dashboard</h1>
            <p className="text-gray-500 mt-2">
              Manage your bakery products inventory and details
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isSelectionMode && selectedProducts.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => setIsBulkDeleteDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Trash className="h-4 w-4" />
                Delete Selected ({selectedProducts.length})
              </Button>
            )}
            <Button
              variant={isSelectionMode ? "outline" : "secondary"}
              size="sm"
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                setSelectedProducts([]);
              }}
            >
              {isSelectionMode ? (
                <>
                  <X className="mr-2 h-4 w-4" /> Cancel Selection
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" /> Select
                </>
              )}
            </Button>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              variant="yellow"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full bg-gray-50 rounded-md py-3 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-black"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }
                }}
              />
            </div>
            <Button
              onClick={() => {
                setSubmittedSearch(searchQuery);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              variant="yellow"
              className="py-3 px-4"
            >
              Search
            </Button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Select
                  name="category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  options={categoryFilterOptions}
                  className="w-[180px] bg-gray-50"
                />
              </div>

              <div className="relative flex-1 sm:flex-none">
                <Select
                  name="availability"
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  options={availabilityOptions}
                  className="w-[180px] bg-gray-50"
                />
              </div>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSubmittedSearch("");
                  setCategoryFilter("all");
                  setAvailabilityFilter("all");
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {loading ? (
            <SkeletonAdmin />
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Package className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-400 mb-6">
                {isFiltering
                  ? "No products match your current filters"
                  : "Get started by adding your first product"}
              </p>
              {isFiltering ? (
                <div></div>
              ) : (
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  variant="yellow"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              )}
            </div>
          ) : (
            <>
              {isSelectionMode && (
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={
                        selectedProducts.length === products.length &&
                        products.length > 0
                      }
                      onChange={toggleSelectAll}
                      label="Select All"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedProducts.length} of {products.length} selected
                  </div>
                </div>
              )}

              <div>
                {loading ? (
                  <SkeletonAdmin />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <div
                        key={product.product_id}
                        className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:translate-y-[-4px] hover:shadow-md relative"
                      >
                        {isSelectionMode && (
                          <div className="absolute top-2 left-2 z-10">
                            <Checkbox
                              checked={selectedProducts.includes(
                                product.product_id
                              )}
                              onChange={() =>
                                toggleProductSelection(product.product_id)
                              }
                              className="h-5 w-5 bg-white border-gray-300"
                            />
                          </div>
                        )}

                        <div
                          className="h-[180px] bg-gray-100 flex items-center justify-center relative cursor-pointer"
                          onClick={() => {
                            if (!isSelectionMode) {
                              setCurrentProduct(product);
                              setIsEditDialogOpen(true);
                            }
                          }}
                        >
                          {!product.is_available && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="absolute inset-0 bg-gray-500 bg-opacity-30" />
                              <Badge
                                variant="destructive"
                                className="text-sm z-10 flex items-center justify-center"
                              >
                                Out of Stock
                              </Badge>
                            </div>
                          )}
                          {product.image_url ? (
                            <Image
                              src={`${product.image_url}?t=${Date.now()}`}
                              alt={product.name}
                              className={`relative h-full w-full object-cover ${
                                !product.is_available
                                  ? "grayscale opacity-50"
                                  : ""
                              }`}
                              sizes="100%"
                              width="10"
                              height="10"
                            />
                          ) : (
                            <Package size={48} className="text-gray-400" />
                          )}
                        </div>

                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg">
                              {product.name.length > 30
                                ? `${product.name.substring(0, 30)}...`
                                : product.name}
                            </h3>
                            {!isSelectionMode && (
                              <div className="relative">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                ></Button>
                              </div>
                            )}
                          </div>

                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                            {product.description.length > 80
                              ? `${product.description.substring(0, 80)}...`
                              : product.description}
                          </p>

                          <div className="flex justify-between items-center mb-2">
                            <p className="text-lg font-bold">
                              $
                              {!isNaN(Number(product.price))
                                ? Number(product.price).toFixed(2)
                                : "0.00"}
                            </p>

                            <Badge
                              variant={getStockStatusVariant(
                                product.stock_quantity
                              )}
                            >
                              {getStockStatusText(product.stock_quantity)}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                            {product.seasonal &&
                              product.seasonal !== "none" &&
                              seasonalStyles[product.seasonal] &&
                              (() => {
                                const { icon: Icon, bg } =
                                  seasonalStyles[product.seasonal];
                                return (
                                  <span
                                    className={`flex items-center gap-1 ${bg} text-white px-2 py-1 rounded`}
                                  >
                                    <Icon size={14} />
                                    {product.seasonal}
                                  </span>
                                );
                              })()}
                            {product.size !== "none" && product.size && (
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                {product.size}
                              </span>
                            )}
                            {product.collection !== "none" &&
                              product.collection && (
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                  {product.collection}
                                </span>
                              )}

                            <span className="bg-gray-100 px-2 py-1 rounded">
                              Stock: {product.stock_quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Pagination Component */}
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                showInfo={true}
                maxVisiblePages={5}
              />
            </>
          )}
        </div>

        {/* Add Product Dialog */}
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            // Reset image and errors when dialog is closed
            if (!open) {
              setNewProductImage(null);
              setFormErrors({});
            }
          }}
        >
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProduct}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <EditImageUpload
                    currentImage={getCacheBustedImageUrl(
                      currentProduct?.image_url ?? ""
                    )}
                    onImageChange={(file) => setNewProductImage(file)}
                    error={!!formErrors.image_url}
                    errorMsg={formErrors.image_url}
                    required={true}
                  />

                  <div className="col-span-2">
                    <InputAdmin
                      name="name"
                      label="Product Name"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      error={!!formErrors.name}
                      errorMsg={formErrors.name}
                      required={true}
                      className="rounded-md"
                    />
                  </div>

                  <div className="col-span-2">
                    <TextareaAdmin
                      name="description"
                      label="Description"
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      error={!!formErrors.description}
                      errorMsg={formErrors.description}
                      required={true}
                      className="rounded-md"
                    />
                  </div>

                  <div>
                    <InputAdmin
                      name="price"
                      label="Price ($)"
                      type="number"
                      value={newProduct.price?.toString()}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price: parseFloat(e.target.value),
                        })
                      }
                      error={!!formErrors.price}
                      errorMsg={formErrors.price}
                      required={true}
                      className="rounded-md"
                    />
                  </div>

                  <div>
                    <InputAdmin
                      name="stock"
                      label="Stock Quantity"
                      type="number"
                      value={newProduct.stock_quantity?.toString()}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          stock_quantity: parseInt(e.target.value),
                        })
                      }
                      error={!!formErrors.stock_quantity}
                      errorMsg={formErrors.stock_quantity}
                      required={true}
                      className="rounded-md"
                    />
                  </div>

                  <div>
                    <Select
                      name="category"
                      label="Category"
                      value={
                        newProduct.category_id
                          ? newProduct.category_id.toString()
                          : ""
                      }
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category_id: e.target.value
                            ? parseInt(e.target.value)
                            : null,
                        })
                      }
                      options={categoryOptions}
                      error={!!formErrors.category_id}
                      errorMsg={formErrors.category_id}
                      required={true}
                    />
                  </div>

                  <div>
                    <InputAdmin
                      name="size"
                      label="Size"
                      value={newProduct.size}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, size: e.target.value })
                      }
                      error={!!formErrors.size}
                      errorMsg={formErrors.size}
                      required={false}
                      className="rounded-md"
                    />
                  </div>

                  <div>
                    <InputAdmin
                      name="collection"
                      label="Collection"
                      value={newProduct.collection}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          collection: e.target.value,
                        })
                      }
                      error={!!formErrors.collection}
                      errorMsg={formErrors.collection}
                      required={false}
                      className="rounded-md"
                    />
                  </div>

                  <div>
                    <Select
                      name="seasonal"
                      label="Season"
                      value={newProduct.seasonal}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          seasonal: e.target.value,
                        })
                      }
                      options={seasonalOptions}
                      error={!!formErrors.seasonal}
                      errorMsg={formErrors.seasonal}
                      required={false}
                    />
                  </div>

                  <div className="col-span-2">
                    <TextareaAdmin
                      name="ingredients"
                      label="Ingredients"
                      value={newProduct.ingredients}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          ingredients: e.target.value,
                        })
                      }
                      error={!!formErrors.ingredients}
                      errorMsg={formErrors.ingredients}
                      required={true}
                    />
                  </div>

                  <div className="col-span-2">
                    <TextareaAdmin
                      name="allergens"
                      label="Allergens"
                      value={newProduct.allergens}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          allergens: e.target.value,
                        })
                      }
                      error={!!formErrors.allergens}
                      errorMsg={formErrors.allergens}
                      required={true}
                    />
                  </div>

                  <div className="col-span-2">
                    <TextareaAdmin
                      name="nutritional_info"
                      label="Nutritional Info"
                      value={newProduct.nutritional_info}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          nutritional_info: e.target.value,
                        })
                      }
                      error={!!formErrors.nutritional_info}
                      errorMsg={formErrors.nutritional_info}
                      required={true}
                    />
                  </div>

                  <div className="col-span-2">
                    <InputAdmin
                      name="min_order_quantity"
                      label="Minimum Order Quantity"
                      type="number"
                      value={newProduct.min_order_quantity?.toString()}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          min_order_quantity: parseInt(e.target.value),
                        })
                      }
                      error={!!formErrors.min_order_quantity}
                      errorMsg={formErrors.min_order_quantity}
                      required={true}
                      className="rounded-md"
                    />
                  </div>

                  <div className="col-span-2 flex items-center gap-2">
                    <Checkbox
                      id="is_available"
                      name="is_available"
                      checked={newProduct.is_available}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          is_available: e.target.checked,
                        })
                      }
                      label="Product is available for purchase"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="yellow"
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add Product
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            // Reset image when dialog is closed
            if (!open) {
              setEditProductImage(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditProduct}>
              {currentProduct && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <EditImageUpload
                      currentImage={currentProduct.image_url}
                      onImageChange={(file) => setEditProductImage(file)}
                      error={!!editFormErrors.image_url}
                      errorMsg={editFormErrors.image_url}
                      required={true}
                    />
                    <div className="col-span-2">
                      <InputAdmin
                        name="edit-name"
                        label="Product Name"
                        value={currentProduct.name}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            name: e.target.value,
                          })
                        }
                        error={!!editFormErrors.name}
                        errorMsg={editFormErrors.name}
                        required={true}
                        className="rounded-md"
                      />
                    </div>
                    <div className="col-span-2">
                      <TextareaAdmin
                        name="edit-description"
                        label="Description"
                        value={currentProduct.description}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            description: e.target.value,
                          })
                        }
                        error={!!editFormErrors.description}
                        errorMsg={editFormErrors.description}
                        required={true}
                      />
                    </div>
                    <div>
                      <InputAdmin
                        name="edit-price"
                        label="Price ($)"
                        type="number"
                        value={
                          currentProduct.price != null
                            ? currentProduct.price.toString()
                            : "0"
                        }
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            price: Number.parseFloat(e.target.value),
                          })
                        }
                        error={!!editFormErrors.price}
                        errorMsg={editFormErrors.price}
                        required={true}
                        className="rounded-md"
                      />
                    </div>
                    <div>
                      <InputAdmin
                        name="edit-stock"
                        label="Stock Quantity"
                        type="number"
                        value={currentProduct.stock_quantity.toString()}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            stock_quantity: Number.parseInt(e.target.value),
                          })
                        }
                        error={!!editFormErrors.stock_quantity}
                        errorMsg={editFormErrors.stock_quantity}
                        required={true}
                        className="rounded-md"
                      />
                    </div>
                    <div>
                      <Select
                        name="edit-category"
                        label="Category"
                        value={
                          currentProduct.category_id
                            ? currentProduct.category_id.toString()
                            : ""
                        }
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            category_id: Number.parseInt(e.target.value),
                          })
                        }
                        options={categoryOptions}
                        error={!!editFormErrors.category_id}
                        errorMsg={editFormErrors.category_id}
                        required={true}
                      />
                    </div>
                    <div>
                      <InputAdmin
                        name="edit-size"
                        label="Size"
                        value={currentProduct.size}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            size: e.target.value,
                          })
                        }
                        error={!!editFormErrors.size}
                        errorMsg={editFormErrors.size}
                        required={false}
                        className="rounded-md"
                      />
                    </div>
                    <div>
                      <InputAdmin
                        name="edit-collection"
                        label="Collection"
                        value={currentProduct.collection}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            collection: e.target.value,
                          })
                        }
                        error={!!editFormErrors.collection}
                        errorMsg={editFormErrors.collection}
                        required={false}
                        className="rounded-md"
                      />
                    </div>
                    <div>
                      <Select
                        name="edit-seasonal"
                        label="Seasonal"
                        value={currentProduct.seasonal}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            seasonal: e.target.value,
                          })
                        }
                        options={seasonalOptions}
                        error={!!editFormErrors.seasonal}
                        errorMsg={editFormErrors.seasonal}
                        required={false}
                      />
                    </div>
                    <div className="col-span-2">
                      <TextareaAdmin
                        name="edit-ingredients"
                        label="Ingredients"
                        value={currentProduct.ingredients}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            ingredients: e.target.value,
                          })
                        }
                        error={!!editFormErrors.ingredients}
                        errorMsg={editFormErrors.ingredients}
                        required={true}
                      />
                    </div>
                    <div className="col-span-2">
                      <TextareaAdmin
                        name="edit-allergens"
                        label="Allergens"
                        value={currentProduct.allergens}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            allergens: e.target.value,
                          })
                        }
                        error={!!editFormErrors.allergens}
                        errorMsg={editFormErrors.allergens}
                        required={true}
                      />
                    </div>
                    <div className="col-span-2">
                      <TextareaAdmin
                        name="edit-nutritional_info"
                        label="Nutritional Info"
                        value={currentProduct.nutritional_info}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            nutritional_info: e.target.value,
                          })
                        }
                        error={!!editFormErrors.nutritional_info}
                        errorMsg={editFormErrors.nutritional_info}
                        required={true}
                      />
                    </div>
                    <div className="col-span-2">
                      <InputAdmin
                        name="edit-min_order_quantity"
                        label="Minimum Order Quantity"
                        type="number"
                        value={currentProduct.min_order_quantity?.toString()}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            min_order_quantity: parseInt(e.target.value),
                          })
                        }
                        error={!!editFormErrors.min_order_quantity}
                        errorMsg={editFormErrors.min_order_quantity}
                        required={true}
                        className="rounded-md"
                      />
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Checkbox
                        id="edit-is_available"
                        name="edit-is_available"
                        checked={currentProduct.is_available}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            is_available: e.target.checked,
                          })
                        }
                        label="Product is available for purchase"
                      />
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter className="flex justify-between sm:justify-between">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setIsDeleteDialogOpen(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="yellow"
                    className="flex items-center gap-2"
                    disabled={loading} // optionally disable during loading
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Bulk Delete Confirmation Dialog */}
        <Dialog
          open={isBulkDeleteDialogOpen}
          onOpenChange={setIsBulkDeleteDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Bulk Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Are you sure you want to delete the selected products? This
                action cannot be undone.
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-md max-h-[150px] overflow-y-auto">
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {products
                    .filter((product) =>
                      selectedProducts.includes(product.product_id)
                    )
                    .map((product) => (
                      <li key={product.product_id}>{product.name}</li>
                    ))}
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsBulkDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await handleBulkDelete();
                  setIsBulkDeleteDialogOpen(false);
                }}
                className="flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash className="h-4 w-4" />
                    Delete Selected
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>
              {currentProduct && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="font-medium">{currentProduct.name}</p>
                  <p className="text-sm text-gray-500">
                    {currentProduct.description}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteProduct}
                className="flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Deleting Product...
                  </>
                ) : (
                  <>
                    <Trash className="h-4 w-4" />
                    Delete Product
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <CustomAlert
        alerts={alerts}
        onClose={(id) => {
          setAlerts((prev) => prev.filter((alert) => alert.id !== id));
        }}
      />
    </div>
  );
};

export default AdminProductsDashboard;
