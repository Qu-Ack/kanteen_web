"use client";
import { Category, useItemContext } from "@/services/ItemAndCategoryContext";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DeleteConfirmationModalProps {
  categoryName: string;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  categoryName,
  onClose,
  onDelete,
}) => {
  const [inputValue, setInputValue] = useState("");

  const isConfirmed = inputValue === categoryName;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-red-600 mb-4">Delete Category</h2>
        <p className="text-red-500 mb-4">
          Deleting this category will also delete all items associated with it.
          This action cannot be undone. Please type the category name{" "}
          <strong>{categoryName}</strong> to confirm.
        </p>
        <input
          type="text"
          placeholder="Type category name"
          className="border p-2 w-full mb-4"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 mr-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`bg-red-500 text-white px-4 py-2 rounded ${isConfirmed ? "" : "opacity-50 cursor-not-allowed"}`}
            onClick={onDelete}
            disabled={!isConfirmed}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CategoryFunction() {
  const { getCategories, categories, deleteCategory } = useItemContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    getCategories();
  }, []);

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory({ id: category.ID, name: category.Name });
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      deleteCategory(selectedCategory.id);
      setShowModal(false);
    }
  };

  return (
    <div>
      <Link href={`/dashboard/category/add`}>
        <button className="bg-blue-500 text-white px-4 py-2 mb-4 rounded">
          Add Category
        </button>
      </Link>

      <ul>
        {categories &&
          categories.map((category) => (
            <li
              key={`${category.ID}`}
              className="flex items-center justify-between p-2 border-b"
            >
              <span>{category.Name}</span>
              <div>
                <Link href={`/dashboard/category/update/${category.ID}`}>
                  <button className="bg-yellow-400 text-white px-2 py-1 mr-2 rounded">
                    Update
                  </button>
                </Link>

                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteClick(category)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>

      {showModal && selectedCategory && (
        <DeleteConfirmationModal
          categoryName={selectedCategory.name}
          onClose={() => setShowModal(false)}
          onDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
}
