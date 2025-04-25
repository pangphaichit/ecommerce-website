import Button from "@/components/ui/Button";
import {
  Plus,
  Trash,
  Save,
  Edit,
  Download,
  Upload,
  Search,
  Filter,
  Check,
  X,
} from "lucide-react";

function ButtonCollection() {
  return (
    <div className="p-6 space-y-8 bg-gray-50">
      <div>
        <h2 className="text-lg font-semibold mb-4">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="yellow">Yellow</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="icon-sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Buttons with Icons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="yellow">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="success">
            <Check className="mr-2 h-4 w-4" /> Save
          </Button>
          <Button variant="secondary">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Icon Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon">
            <Trash className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="yellow" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="success" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Disabled Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button disabled>Disabled</Button>
          <Button disabled variant="secondary">
            Disabled
          </Button>
          <Button disabled variant="destructive">
            Disabled
          </Button>
          <Button disabled variant="outline">
            Disabled
          </Button>
          <Button disabled variant="ghost">
            Disabled
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Button Usage Examples</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-medium">Product Actions</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button variant="yellow" size="sm">
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-medium">Bulk Actions</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Select All
              </Button>
              <Button variant="destructive" size="sm">
                <Trash className="mr-2 h-4 w-4" /> Delete Selected
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-medium">Add New Item</h3>
            <Button variant="yellow" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ButtonCollection;
