"use client";
import { createContext, useContext, useState } from "react";
import { Item } from "@/app/(flow)/dashboard/item/page";

export type Category = {
  ID: number;
  Name: string;
};

interface ContextType {
  items: Item[];
  categories: Category[];
  getItems(): Promise<void>;
  updateItem(item: Item): Promise<void>;
  addCategory(item: any): Promise<void>;
  getCategories(): Promise<void>;
  updateCategory(item: any): Promise<void>;
  selectItem(id: Number): void;
  postItem(item: Item): void;
  deleteItem(id: number): void;
  deleteCategory(id: number): void;
}

export const ItemContext = createContext<ContextType | undefined>(undefined);

export function ItemContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [item, setItem] = useState<Item | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);

  async function getItems() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}item`, {
        cache: "no-store",
      });
      const data = await response.json();
      console.log("Getting Items..");
      setItems(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteItem(id: number) {
    const data_send = {
      item_id: id,
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}item`, {
        method: "DELETE",
        body: JSON.stringify(data_send),
      });
      if (!response.ok) {
        console.log("response was not ok");
      }
      setItems(items.filter((i) => i.ID !== id));
    } catch (err) {
      console.log(err);
    }
  }

  function selectItem(id: number) {
    const selectedItem = items.find((item) => item.ID === id);
    setItem(selectedItem);
  }

  async function getCategories() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}category`,
        { cache: "no-store" },
      );
      const data = await response.json();
      setCategories(data);
    } catch (err) {}
  }

  async function addCategory(item: any) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}category`,
        {
          method: "POST",
          body: JSON.stringify(item),
        },
      );
      if (!response.ok) {
        console.log("something went wrong");
      }
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function updateCategory(item: any) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}category`,
        {
          method: "PUT",
          body: JSON.stringify(item),
        },
      );
      if (!response.ok) {
        console.log("something went wrong");
      }
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteCategory(id: number) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}category`,
        {
          method: "DELETE",
          body: JSON.stringify({ category_id: id }),
        },
      );
      if (!response.ok) {
        console.log("something went wrong");
      }
      console.log(response);
      setCategories(categories.filter((c) => c.ID !== id));
    } catch (err) {
      console.log(err);
    }
  }

  async function postItem(item: Item) {
    const data_send = {
      name: item.Name,
      price: item.Price,
      stock: item.Stock,
      category_id: item.CategoryID,
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}item`, {
        method: "POST",
        body: JSON.stringify(data_send),
      });
      if (!response.ok) {
        console.log("response was not ok");
      }
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function updateItem(item: Item) {
    const data_send: {
      name: string;
      price: number;
      stock: number;
      category_id: number;
      item_id: number;
    } = {
      name: item.Name,
      price: item.Price,
      stock: item.Stock,
      category_id: item.CategoryID,
      item_id: item.ID,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}item`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data_send),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setItems(
        items.map((elem) => {
          if (elem.ID === item.ID) {
            return item;
          }
          return elem;
        }),
      );
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <ItemContext.Provider
      value={{
        items,
        deleteCategory,
        updateCategory,
        addCategory,
        categories,
        getItems,
        updateItem,
        getCategories,
        selectItem,
        postItem,
        deleteItem,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
}

export function useItemContext() {
  const itemContext = useContext(ItemContext);

  if (!itemContext) {
    throw new Error("useItemContext must be used within a ItemContextProvider");
  }
  return itemContext;
}
