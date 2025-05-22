import { useRef, useState, useEffect } from "react";
import { ImagePlus } from "lucide-react";

interface EditImageUploadProps {
  currentImage?: string;
  onImageChange: (file: File) => void;
  error?: boolean;
  errorMsg?: string;
  required?: boolean;
}

function EditImageUpload({
  currentImage,
  onImageChange,
  error = false,
  errorMsg = "",
  required = false,
}: EditImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage ?? null);

  useEffect(() => {
    setPreview(currentImage ?? null);
  }, [currentImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      onImageChange(file);
    }
  };

  return (
    <div className="col-span-2">
      <div className="flex flex-row justify-between">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Image
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {error && errorMsg && (
          <p className="text-sm text-red-500 mt-1">{errorMsg}</p>
        )}
      </div>
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer w-full aspect-square rounded-md border-2 border-dashed ${
          error ? "border-red-500 bg-red-100" : "border-gray-300"
        } flex flex-col items-center justify-center hover:bg-gray-50 transition`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="object-cover w-full h-full rounded-md"
          />
        ) : (
          <>
            <ImagePlus className="w-8 h-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Add Image</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

export default EditImageUpload;
