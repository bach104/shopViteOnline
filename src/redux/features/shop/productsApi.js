import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: getBaseUrl() + "/api" }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page, limit, material, category, season, minPrice, maxPrice }) =>
        `/products?page=${page}&limit=${limit}&material=${material || ""}&category=${category || ""}&season=${season || ""}&minPrice=${minPrice || ""}&maxPrice=${maxPrice || ""}`,
      providesTags: [{ type: "Product", id: "LIST" }],
      transformResponse: (response) => ({
        products: response.products,
        totalPages: response.totalPages,
        totalProducts: response.totalProducts,
      }),
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
      transformResponse: (response) => ({
        ...response,
        size: response.size || [],
        color: response.color || [],
      }),
    }),
    rateProduct: builder.mutation({
      query: ({ productId, star }) => ({
        url: "/products/rate",
        method: "POST",
        body: { productId, star },
        credentials: "include",
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),
    getProductRating: builder.query({
      query: (productId) => `/products/${productId}/rating`,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),
    getTopFeaturedProducts: builder.query({
      query: () => "/products/top-featured",
      providesTags: [{ type: "Product", id: "TOP" }],
    }),
    getProductsBySeason: builder.query({
      query: ({ season, page, limit }) =>
        `/products/season/${season}?page=${page}&limit=${limit}`,
      providesTags: [{ type: "Product", id: "SEASON" }],
    }),
    getRandomProducts: builder.query({
      query: () => "/products/random",
      providesTags: [{ type: "Product", id: "RANDOM" }],
    }),
    addProduct: builder.mutation({
      query: (productData) => ({
        url: "/products/addProducts",
        method: "POST",
        body: productData,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, productData }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: productData,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (deleteData) => ({
        url: '/products/delete',
        method: 'DELETE',
        body: deleteData,
        credentials: 'include',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Product', id: 'LIST' },
        ...(arg.productId ? [{ type: 'Product', id: arg.productId }] : []),
        ...(arg.productIds ? arg.productIds.map(id => ({ type: 'Product', id })) : []),
      ],
    }),
  }),

});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useRateProductMutation,
  useGetProductRatingQuery,
  useGetTopFeaturedProductsQuery,
  useGetProductsBySeasonQuery,
  useLazyGetProductsBySearchQuery,
  useGetRandomProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;