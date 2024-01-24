import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getUserFromLocalStorage,customFetch} from "../../utils/axios";
import { logoutUser } from "../user/userSlice";
import { showLoading, hideLoading, getAllJobs } from "../allJobs/allJobsSlice";
import { authHeader } from "../../utils/axios";
const initialState = {
  isLoading: false,
  position: "",
  company: "",
  jobLocation: "",
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  jobType: "full-time",
  statusOptions: ["interview", "declined", "pending"],
  status: "pending",
  isEditing: false,
  editJobId: "",
};


export const createJob=createAsyncThunk(
  'job/createJob',
  async(job,thunkAPI)=>{
    try{
      const resp=await customFetch.post('/jobs',job,authHeader(thunkAPI));
      thunkAPI.dispatch(clearValues());
      return resp.data;
    }catch(err){
      if(err.response.status===401){
        thunkAPI.dispatch(logoutUser());
        return thunkAPI.rejectWithValue('Uuauthorized! logging out...')
      }
      return thunkAPI.rejectWithValue(err.response.dta.msg);

      
    }
  }
)


export const deleteJob = createAsyncThunk(
  "job/deleteJob",
  async (jobId, thunkAPI) => {
    thunkAPI.dispatch(showLoading());
    try {
      const resp = await customFetch.delete(`/jobs/${jobId}`,authHeader(thunkAPI));
      thunkAPI.dispatch(getAllJobs());
      return resp.data;
    } catch (error) {
      thunkAPI.dispatch(hideLoading());
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const editJob = createAsyncThunk(
  'job/editJob',
  async ({ jobId, job }, thunkAPI) => {
    try {
      const resp = await customFetch.patch(`/jobs/${jobId}`, job,authHeader(thunkAPI));
      thunkAPI.dispatch(clearValues());
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers:{
    handleChange:(state,{payload:{name,value}})=>{
      state[name]=value;
    },
    
      clearValues: () => {
      return {
        ...initialState
      };
    },

    setEditJob:(state,{payload})=>{
      return {...state,isEditing:true,...payload};
    },
    
  },
  extraReducers: (builder)=>{
    builder
    .addCase(createJob.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(createJob.fulfilled, (state) => {
      state.isLoading = false;
      toast.success('Job Created');
    })
    .addCase(createJob.rejected, (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    })
     .addCase(deleteJob.fulfilled, (state, { payload }) => {
      // state.isLoading = false;
      toast.success(payload);
    })
    .addCase(deleteJob.rejected, (state, { payload }) => {
      // state.isLoading = false;
      toast.error(payload);
    })
    .addCase(editJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editJob.fulfilled, (state) => {
        state.isLoading = false;
        toast.success('Job Modified...');
      })
      .addCase(editJob.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      });
}
});

export const {handleChange,clearValues,setEditJob}=jobSlice.actions;
export default jobSlice.reducer;