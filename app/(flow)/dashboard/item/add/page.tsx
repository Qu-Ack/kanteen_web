"use client";

import { useEffect, useState } from "react";
import { Item } from "@/app/(flow)/dashboard/item/page";
import { useItemContext } from "@/services/ItemAndCategoryContext";
import { useRouter } from "next/navigation";

export type ItemKey = keyof Item;

export default function UpdatePage({ params }: { params: { id: number } }) {
  const router = useRouter();
  const [item, setItem] = useState<Item | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null); // To store form data for later use
  const { items, getCategories, postItem, categories } = useItemContext();

  useEffect(() => {
    getCategories();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setItem((prevItem: any) => ({
      ...prevItem,
      [name as ItemKey]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setFormData(formData); // Save the form data
    setShowModal(true); // Show confirmation modal
  }

  function confirmUpdate() {
    if (!formData) return; // If formData is not available, do nothing

    const name = formData.get("Name") as string;
    const price = formData.get("Price") as string;
    const stock = formData.get("Stock") as string;
    const categoryName = formData.get("CategoryName") as string;

    const category = categories.find((cat) => cat.Name === categoryName);
    const category_id = category ? category.ID : 0;
    let data: Item = {
      ID: params.id,
      Name: name,
      Price: parseInt(price),
      Stock: parseInt(stock),
      CategoryID: category_id as number,
    };

    postItem(data);
    setShowModal(false); // Close the modal after confirming
    router.push("/dashboard/item");
  }

  function cancelUpdate() {
    setShowModal(false); // Close the modal without updating
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-[50%] flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            name="Name"
            className="border-zinc-500 border-2 p-2"
            onChange={handleChange}
            value={item?.Name}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="price">Price: </label>
          <input
            type="number"
            name="Price"
            className="border-zinc-500 border-2 p-2"
            onChange={handleChange}
            value={item?.Price}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="stock">Stock: </label>
          <input
            type="number"
            name="Stock"
            className="border-zinc-500 border-2 p-2"
            onChange={handleChange}
            value={item?.Stock}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="category">Category: </label>
          <select
            name="CategoryName"
            id="category"
            className="border-zinc-500 border-2 p-2"
            onChange={handleChange}
          >
            {categories.map((category) => {
              console.log(category);
              return <option key={`${category.ID}`}>{category.Name}</option>;
            })}
          </select>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Item
        </button>
      </form>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[30%]">
            <h2 className="text-xl mb-4">Are you sure?</h2>
            <p>Do you really want to add this item?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={cancelUpdate}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
