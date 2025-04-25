import { useState, useEffect } from "react";
import {
  Package,
  Search,
  Plus,
  MoreHorizontal,
  Trash,
  Check,
  X,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DialogComponents from "@/components/ui/Dialog";
import InputAdmin from "@/components/ui/InputAdmin";
import Checkbox from "@/components/ui/Checkbox";
import Select from "@/components/ui/Select";
import TextareaAdmin from "@/components/ui/TextareaAdmin";
import EditImageUpload from "./EditImageUpload";

interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number | null;
  is_available: boolean;
  category_id: number;
  size: string;
  ingredients: string;
  allergens: string;
  nutritional_info: string;
  season: string;
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

const initialProducts: Product[] = [
  {
    product_id: "p001",
    name: "Strawberry Tart",
    description: "Fresh strawberries on a buttery crust.",
    price: 7.99,
    is_available: true,
    category_id: 1,
    size: "Medium",
    ingredients: "Strawberries, flour, butter, sugar",
    allergens: "Gluten, Dairy",
    nutritional_info: "300 kcal",
    season: "summer",
    collection: "Summer Delights",
    stock_quantity: 20,
    min_order_quantity: 1,
    image_url:
      "https://boeraqxraijbxhlrtdnn.supabase.co/storage/v1/object/public/image//diliara-garifullina-THMuaASAP5Y-unsplash%20(1).jpg",
    slug: "strawberry-tart",
  },
  {
    product_id: "p002",
    name: "Chocolate Mousse",
    description: "Rich and creamy chocolate mousse.",
    price: 5.49,
    is_available: false,
    category_id: 2,
    size: "Small",
    ingredients: "Chocolate, cream, eggs",
    allergens: "Dairy, Eggs",
    nutritional_info: "250 kcal",
    season: "winter",
    collection: "Winter Treats",
    stock_quantity: 0,
    min_order_quantity: 1,
    image_url:
      "https://boeraqxraijbxhlrtdnn.supabase.co/storage/v1/object/public/image//american-heritage-chocolate-YxjIO0LmDO0-unsplash.jpg",
    slug: "chocolate-mousse",
  },
];

const AdminProductsDashboard = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: null,
    is_available: true,
    category_id: 1,
    size: "",
    ingredients: "",
    allergens: "",
    nutritional_info: "",
    season: "",
    collection: "",
    stock_quantity: 1,
    min_order_quantity: 1,
    image_url: "",
  });

  const [formErrors, setFormErrors] = useState<ValidationErrors>({});

  const [editFormErrors, setEditFormErrors] = useState<ValidationErrors>({});

  const [newProductImage, setNewProductImage] = useState<File | null>(null);
  const [editProductImage, setEditProductImage] = useState<File | null>(null);

  const { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } =
    DialogComponents;

  // Filter products based on search query and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      product.category_id.toString() === categoryFilter;

    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && product.is_available) ||
      (availabilityFilter === "unavailable" && !product.is_available);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  //validate form
  const validateProductForm = (product: Partial<Product>): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!newProductImage) {
      errors.image_url = "Product image is required";
    }

    // Required: name
    if (!product.name || product.name.trim() === "") {
      errors.name = "Product name is required";
    } else if (product.name.length < 3) {
      errors.name = "Product name must be at least 3 characters";
    } else if (product.name.length > 255) {
      errors.name = "Product name must be less than 255 characters";
    }

    // Required: price
    if (product.price === undefined || product.price === null) {
      errors.price = "Price is required";
    } else if (isNaN(Number(product.price)) || Number(product.price) <= 0) {
      errors.price = "Price must be greater than 0";
    } else if (Number(product.price) > 9999999.99) {
      errors.price = "Price exceeds maximum allowed value";
    }

    // Required: stock_quantity
    if (
      product.stock_quantity === undefined ||
      product.stock_quantity === null
    ) {
      errors.stock_quantity = "Stock quantity is required";
    } else if (
      isNaN(Number(product.stock_quantity)) ||
      !Number.isInteger(Number(product.stock_quantity)) ||
      Number(product.stock_quantity) < 0
    ) {
      errors.stock_quantity = "Stock quantity must be a non-negative integer";
    }

    // Required: min_order_quantity
    if (
      product.min_order_quantity === undefined ||
      product.min_order_quantity === null
    ) {
      errors.min_order_quantity = "Minimum order quantity is required";
    } else if (
      isNaN(Number(product.min_order_quantity)) ||
      !Number.isInteger(Number(product.min_order_quantity)) ||
      Number(product.min_order_quantity) < 1
    ) {
      errors.min_order_quantity = "Minimum order quantity must be at least 1";
    }

    // Required: category_id
    if (!product.category_id) {
      errors.category_id = "Category is required";
    }

    // Required: description, ingredients, allergens, nutritional_info
    const requiredTextFields: (keyof Product)[] = [
      "description",
      "ingredients",
      "allergens",
      "nutritional_info",
    ];

    requiredTextFields.forEach((key) => {
      const value = product[key];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errors[key] = `${key.replace(/_/g, " ")} is required`;
      }
    });

    // Optional fields max length check (all < 500 unless noted)
    const optionalFields: [keyof Product, number][] = [
      ["size", 50],
      ["collection", 100],
      ["ingredients", 500],
      ["allergens", 500],
      ["nutritional_info", 500],
      ["description", 500],
    ];

    optionalFields.forEach(([key, maxLength]) => {
      const value = product[key];
      if (value && typeof value === "string" && value.length > maxLength) {
        errors[key] = `${key.replace(
          /_/g,
          " "
        )} must be less than ${maxLength} characters`;
      }
    });

    // Season ENUM check
    const validSeasons = [
      "Christmas",
      "Valentine's",
      "Easter",
      "New Year",
      "Halloween",
      "Mother's Day",
      "Father's Day",
    ];
    if (product.season && !validSeasons.includes(product.season)) {
      errors.season = `Season must be one of: ${validSeasons.join(", ")}`;
    }

    // Slug generation check
    if (product.name) {
      const slug = product.name.trim().toLowerCase().replace(/\s+/g, "-");
      if (slug.length > 100) {
        errors.slug =
          "Slug generated from name must be less than 100 characters";
      }
    }

    return errors;
  };

  // Validation for Add Product form
  const validateAddProductForm = () => {
    const errors = validateProductForm(newProduct);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validation for Edit Product form
  const validateEditProductForm = () => {
    if (!currentProduct) return false;
    const errors = validateProductForm(currentProduct);
    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //add product
  const handleAddProduct = () => {
    // Validate form before proceeding
    if (!validateAddProductForm()) {
      return; // Stop if validation fails
    }

    const productId = `p${(products.length + 1).toString().padStart(3, "0")}`;
    const slug = newProduct.name?.toLowerCase().replace(/\s+/g, "-") || "";

    // Create a URL for the new image if available
    let imageUrl = newProduct.image_url || "";
    if (newProductImage) {
      imageUrl = URL.createObjectURL(newProductImage);
    }

    const productToAdd: Product = {
      ...(newProduct as Product),
      product_id: productId,
      slug: slug,
      image_url: imageUrl,
    };

    setProducts([...products, productToAdd]);
    setIsAddDialogOpen(false);
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      is_available: true,
      category_id: 1,
      size: "",
      ingredients: "",
      allergens: "",
      nutritional_info: "",
      season: "",
      collection: "",
      stock_quantity: 1,
      min_order_quantity: 1,
      image_url: "",
    });
    setNewProductImage(null);
    // Clear any validation errors
    setFormErrors({});
  };

  //edit product
  const handleEditProduct = () => {
    if (!currentProduct) return;

    if (!validateEditProductForm()) {
      return;
    }

    // Update image URL if a new image was uploaded
    let updatedProduct = { ...currentProduct };
    if (editProductImage) {
      updatedProduct.image_url = URL.createObjectURL(editProductImage);
    }

    setProducts(
      products.map((product) =>
        product.product_id === updatedProduct.product_id
          ? updatedProduct
          : product
      )
    );
    setIsEditDialogOpen(false);
    setCurrentProduct(null);
    setEditProductImage(null);
    setEditFormErrors({});
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

  const handleDeleteProduct = () => {
    if (!currentProduct) return;

    setProducts(
      products.filter(
        (product) => product.product_id !== currentProduct.product_id
      )
    );
    setIsDeleteDialogOpen(false);
    setCurrentProduct(null);
  };

  //Bulk Delete
  const handleBulkDelete = () => {
    setProducts(
      products.filter(
        (product) => !selectedProducts.includes(product.product_id)
      )
    );
    setSelectedProducts([]);
    setIsSelectionMode(false);
  };

  const toggleProductSelection = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(
        filteredProducts.map((product) => product.product_id)
      );
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
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "1", label: "Tarts" },
    { value: "2", label: "Desserts" },
  ];

  // Availability options for select
  const availabilityOptions = [
    { value: "all", label: "All Products" },
    { value: "available", label: "Available" },
    { value: "unavailable", label: "Out of Stock" },
  ];

  // Season options for select
  const seasonOptions = [
    { value: "spring", label: "Spring" },
    { value: "summer", label: "Summer" },
    { value: "fall", label: "Fall" },
    { value: "winter", label: "Winter" },
  ];

  return (
    <div className="p-6 flex-1 bg-gray-50">
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
              onClick={handleBulkDelete}
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
              className="pl-8 w-full bg-gray-50 rounded-md py-1.5 px-3 text-sm focus:outline-none
      focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-black"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Select
                name="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={categoryOptions}
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
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-400 mb-6">
              Get started by adding your first product
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              variant="yellow"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        ) : (
          <>
            {isSelectionMode && (
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={
                      selectedProducts.length === filteredProducts.length &&
                      filteredProducts.length > 0
                    }
                    onChange={toggleSelectAll}
                    label="Select All"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  {selectedProducts.length} of {filteredProducts.length}{" "}
                  selected
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.product_id}
                  className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:translate-y-[-4px] hover:shadow-md relative"
                >
                  {isSelectionMode && (
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={selectedProducts.includes(product.product_id)}
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
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className={`relative h-full w-full object-cover ${
                          !product.is_available ? "grayscale opacity-50" : ""
                        }`}
                      />
                    ) : (
                      <Package size={48} className="text-gray-400" />
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
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
                      {product.description}
                    </p>

                    <div className="flex justify-between items-center mb-2">
                      <p className="text-lg font-bold">
                        ${product.price?.toFixed(2) || "0.00"}
                      </p>
                      <Badge
                        variant={getStockStatusVariant(product.stock_quantity)}
                      >
                        {getStockStatusText(product.stock_quantity)}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {product.size}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {product.collection}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        Stock: {product.stock_quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <EditImageUpload
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
                />
              </div>

              <div>
                <Select
                  name="category"
                  label="Category"
                  value={newProduct.category_id?.toString()}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      category_id: parseInt(e.target.value),
                    })
                  }
                  options={[
                    { value: "1", label: "Tarts" },
                    { value: "2", label: "Desserts" },
                  ]}
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
                />
              </div>

              <div>
                <InputAdmin
                  name="collection"
                  label="Collection"
                  value={newProduct.collection}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, collection: e.target.value })
                  }
                  error={!!formErrors.collection}
                  errorMsg={formErrors.collection}
                  required={false}
                />
              </div>

              <div>
                <Select
                  name="season"
                  label="Season"
                  value={newProduct.season}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, season: e.target.value })
                  }
                  options={seasonOptions}
                  error={!!formErrors.season}
                  errorMsg={formErrors.season}
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

              <div>
                <InputAdmin
                  name="allergens"
                  label="Allergens"
                  value={newProduct.allergens}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, allergens: e.target.value })
                  }
                  error={!!formErrors.allergens}
                  errorMsg={formErrors.allergens}
                  required={true}
                />
              </div>

              <div>
                <InputAdmin
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

              <div>
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
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddProduct}
              variant="yellow"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogFooter>
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {currentProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <EditImageUpload
                  currentImage={currentProduct.image_url}
                  onImageChange={(file) => setEditProductImage(file)}
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
                  />
                </div>
                <div>
                  <Select
                    name="edit-category"
                    label="Category"
                    value={currentProduct.category_id.toString()}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        category_id: Number.parseInt(e.target.value),
                      })
                    }
                    options={[
                      { value: "1", label: "Tarts" },
                      { value: "2", label: "Desserts" },
                    ]}
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
                  />
                </div>
                <div>
                  <Select
                    name="edit-season"
                    label="Season"
                    value={currentProduct.season}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        season: e.target.value,
                      })
                    }
                    options={seasonOptions}
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
                  />
                </div>
                <div>
                  <InputAdmin
                    name="edit-allergens"
                    label="Allergens"
                    value={currentProduct.allergens}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        allergens: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <InputAdmin
                    name="edit-nutritional_info"
                    label="Nutritional Info"
                    value={currentProduct.nutritional_info}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        nutritional_info: e.target.value,
                      })
                    }
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
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditProduct}
                variant="yellow"
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
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
            >
              <Trash className="h-4 w-4" />
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductsDashboard;
