import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import {toast} from 'react-toastify';
import {customFetch,getUserFromLocalStorage,addUserToLocalStorage,removeUserFromLocalStorage} from '../../utils/axios'
const initialState={
    isLoading:false,
    isSidebarOpen: false,
    user:getUserFromLocalStorage(),
}






export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (user, thunkAPI) => {
    try{
        const resp=await customFetch.post('/auth/register',user)
        return resp.data;
    }catch(error){
        return thunkAPI.rejectWithValue(error.response.data.msg);

    }
});
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (user, thunkAPI) => {
    try {
      const resp = await customFetch.post('/auth/login', user);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user, thunkAPI) => {
    try {
      const resp = await customFetch.patch('/auth/updateUser', user, {
        headers: {
          // authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
          authorization: `Bearer `,
        },
      });

      return resp.data;
    } catch (error) {
      // console.log(error.response);
      if (error.response.status === 401) {
        thunkAPI.dispatch(logoutUser());
        return thunkAPI.rejectWithValue('Unauthorized! Logging Out...');
      }
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
      toggleSidebar:(state)=>{
        state.isSidebarOpen=!state.isSidebarOpen;
      },
      logoutUser: (state,{payload}) => {
      state.user = null;
      state.isSidebarOpen = false;
      removeUserFromLocalStorage();
      if(payload){
        toast.success(payload)
      }
    },
    },
    extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        const { user } = payload;
        state.isLoading = false;
        state.user = user;
        addUserToLocalStorage(user);
        toast.success(`Hello There ${user.name}`);
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        const { user } = payload;
        state.isLoading = false;
        state.user = user;
        addUserToLocalStorage(user);

        toast.success(`Welcome Back ${user.name}`);
      }) 
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        const { user } = payload;
        state.isLoading = false;
        state.user = user;
        addUserToLocalStorage(user);

        toast.success(`User Updated!`);
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })
    //   .addCase(clearStore.rejected, () => {
    //     toast.error('There was an error..');
    //   });
  },
})
export const {toggleSidebar,logoutUser}=userSlice.actions
export default userSlice.reducer