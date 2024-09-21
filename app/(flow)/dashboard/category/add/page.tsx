"use client";

import { useEffect, useState } from "react";
import { Category } from "@/services/ItemAndCategoryContext";
import { useItemContext } from "@/services/ItemAndCategoryContext";
import { useRouter } from "next/navigation";
import { warn } from "console";

export default function UpdatePage({ params }: { params: { id: number } }) {
  const router = useRouter();
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const { getCategories, addCategory } = useItemContext();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.currentTarget;
    setCategory((prevItem: any) => ({
      ...prevItem,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setFormData(formData);
    setShowModal(true);
  }

  function confirmUpdate() {
    if (!formData) return;

    const name = formData.get("Name") as string;

    let data: any = {
      name: name,
    };

    addCategory(data);
    getCategories();
    setShowModal(false);
    router.push("/dashboard/category");
  }

  function cancelUpdate() {
    setShowModal(false);
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
            value={category?.Name}
          />
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
