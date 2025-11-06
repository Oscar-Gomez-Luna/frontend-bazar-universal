import { createBrowserRouter } from "react-router-dom";
import SearchBox from "./SearchBox";
import RegisteredPurchases from "./RegisteredPurchases";
import SearchResults, { loaderItems } from "./SearchResult";
import ProductDetail, { loaderProductDetail } from "./ProductDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SearchBox />,
  },
  {
    path: "/items",
    element: <SearchResults />,
    loader: loaderItems,
  },
  {
    path: "/item/:id",
    element: <ProductDetail />,
    loader: loaderProductDetail,
  },
  {
    path: "/sales",
    element: <RegisteredPurchases />,
  },
]);
