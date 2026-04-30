export const CATALOG_PAGE_SIZE = 6;

export const SORT_OPTIONS = [
  {
    value: "newest",
    label: "Newest first"
  },
  {
    value: "price-asc",
    label: "Price: low to high"
  },
  {
    value: "price-desc",
    label: "Price: high to low"
  },
  {
    value: "title-asc",
    label: "Title A-Z"
  }
] as const;
