import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/shops';

const initialState = {
  shops: [],
  currentShop: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all shops
export const getAllShops = createAsyncThunk(
  'shops/getAll',
  async (filters, thunkAPI) => {
    try {
      let url = API_URL;
      if (filters) {
        const params = new URLSearchParams(filters).toString();
        if (params) url += `?${params}`;
      }
      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single shop
export const getShop = createAsyncThunk(
  'shops/getOne',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update shop
export const updateShop = createAsyncThunk(
  'shops/update',
  async ({ id, shopData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(`${API_URL}/${id}`, shopData, config);
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get nearby shops
export const getNearbyShops = createAsyncThunk(
  'shops/nearby',
  async ({ lng, lat, maxDistance }, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/nearby`, {
        params: { lng, lat, maxDistance },
      });
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const shopSlice = createSlice({
  name: 'shops',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all shops
      .addCase(getAllShops.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllShops.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.shops = action.payload;
      })
      .addCase(getAllShops.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get single shop
      .addCase(getShop.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getShop.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentShop = action.payload;
      })
      .addCase(getShop.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update shop
      .addCase(updateShop.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentShop = action.payload;
      })
      // Get nearby shops
      .addCase(getNearbyShops.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.shops = action.payload;
      });
  },
});

export const { reset } = shopSlice.actions;
export default shopSlice.reducer;
