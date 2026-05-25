import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { menuItems } from './fixtures';
import type { MenuItem } from './types';

export const deliApi = createApi({
  reducerPath: 'deliApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getMenu: builder.query<MenuItem[], void>({
      queryFn: () => ({ data: menuItems }),
    }),
  }),
});

export const { useGetMenuQuery } = deliApi;
