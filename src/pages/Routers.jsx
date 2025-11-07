import { createBrowserRouter } from "react-router-dom";
import SearchBox from "./SearchBox";
import RegisteredPurchases from "./RegisteredPurchases";
import ProductDetail, { loaderProductDetail } from "./ProductDetail";
import SearchResults from "./SearchResult";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SearchBox />,
  },
  {
    path: "/items",
    element: <SearchResults />,
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
