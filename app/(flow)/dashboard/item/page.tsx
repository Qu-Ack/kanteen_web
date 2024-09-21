"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useItemContext } from "@/services/ItemAndCategoryContext";
import { useSocket } from "@/services/Websockethook";

export type Item = {
  ID: number;
  CategoryName?: string;
  CategoryID: number;
  Name: string;
  Price: number;
  Stock: number;
};

export default function Item() {
  const { items, getItems, deleteItem, getCategories, categories } =
    useItemContext();
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [typedItemName, setTypedItemName] = useState("");
  const [showNoCategoryModal, setShowNoCategoryModal] = useState(false); // Modal state for no categories
  const { sendMessage } = useSocket();

  useEffect(() => {
    getItems();
    getCategories();
  }, []);

  function handleDelete(item: Item) {
    setItemToDelete(item);
    setShowModal(true); // Show the delete confirmation modal
  }

  function confirmDelete() {
    if (itemToDelete) {
      deleteItem(itemToDelete.ID);
      setShowModal(false); // Close the modal after deleting
      setTypedItemName(""); // Reset the input
    }
  }

  function handleAddItemClick() {
    if (!categories) {
      setShowNoCategoryModal(true); // Show no-category modal if categories is null or undefined
    } else {
      window.location.href = "/dashboard/item/add"; // Redirect to add item page if categories are present
    }
  }

  return (
    <div className="bg-zinc-300 p-6">
      {/* Add New Item Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Items List</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAddItemClick}
        >
          Add Item
        </button>
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items &&
          items.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 border border-zinc-300"
            >
              <h2 className="text-xl font-semibold mb-2">{item.Name}</h2>
              <p className="text-gray-700">
                <span className="font-semibold">Category:</span>{" "}
                {item.CategoryName}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Price:</span> ₹{item.Price}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Stock:</span> {item.Stock}
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-between">
                <Link href={`/dashboard/item/update/${item.ID}`}>
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                    Update
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(item)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && itemToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[30%]">
            <h2 className="text-2xl text-red-600 font-semibold mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-700">
              Are you sure you want to delete{" "}
              <strong>{itemToDelete.Name}</strong>? Type the item name below to
              confirm.
            </p>
            <input
              type="text"
              className="border border-gray-300 p-2 w-full mt-4"
              placeholder="Type item name"
              value={typedItemName}
              onChange={(e) => setTypedItemName(e.target.value)}
            />
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`${
                  typedItemName === itemToDelete.Name
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-red-300"
                } text-white px-4 py-2 rounded`}
                disabled={typedItemName !== itemToDelete.Name}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No Categories Warning Modal */}
      {showNoCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[30%]">
            <h2 className="text-2xl text-red-600 font-semibold mb-4">
              No Categories Available
            </h2>
            <p className="text-gray-700">
              You cannot add an item because there are no categories available.
              Please add a category first.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowNoCategoryModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
              <Link href="/dashboard/category/add">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4">
                  Add Category
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
