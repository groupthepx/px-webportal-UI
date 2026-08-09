// 'use client';
// import { AppThunk, RootState } from '@/lib/store';
// // import { AppThunk } from '@/lib/store';
// import { employeeModel } from '@/model/employee';
// import axios from '@/utils/axios';
// import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import wait from '@/utils/wait';
// // import { useSession } from 'next-auth/react';

// // const initialEmployeePostState: Partial<employeeModel> = {
// //   // Provide initial values for IQuatationPost fields here if needed
// // };

// const initialValues: employeeModel = {

//     employee_id: 0,
//     is_hr: false,
//     fbuid: '',
//     email: '',
//     firstname: '',
//     lastname: '',
//     firstname_la: '',
//     lastname_la: '',
//     mobile: '',
//     start_working_date: '',
//     stop_working_date: '',
//     start_program_date: null,
//     dob: '',
//     profile_img: '',
//     children: null,
//     children_details: null,
//     emergency_contact_name: '',
//     emergency_mobile: '',
//     emergency_villages_id: '',
//     organizational_structure_id: null,
//     organisation_id: 0,
//     field_location_id: null,
//     working_type_id: 0,
//     marital_id: null,
//     levels_id: null,
//     villages_id: 0,
//     gender_id: 0,
//     education_id: 0,
//     face_id: null,
//     emp_positions_id: null,
//     is_active: false,
//     created_at: '',
//     updated_at: '',
//     deleted_at: null,
//     organisation: {
//       organisation_id: 0,
//       company_code: '',
//       company_en: '',
//       company_name: '',
//       company_profile: '',
//       is_active: false,
//       primary_color: '',
//       accent_color: '',
//       created_at: '',
//       updated_at: '',
//       deleted_at: null,
//       villages_id: 0
  
//   }
// };


// export const getEmployee = createAsyncThunk(
//   'employees/getEmployee',
//   async (token: string) => {


//       const employeesData = new Promise<number>(async (resolve, reject) => {
//         const response : any = await axios(token).get('/employees' )

//         await wait(500)
//           if (response) {
//             resolve(response.data);
//           } else {
//             reject(Error(""));
//           }
  
//       });
//       return await employeesData;
//   }
// );


// interface CalendarState {
//   employee: employeeModel;
//   isloading: boolean;


// }

// const initialState: CalendarState = {
//   employee: initialValues,
//   isloading: false,

// };


// const employeeSlice = createSlice({
//   name: 'employees',
//   initialState : initialState,
//   reducers: {
  
//   },
//   extraReducers: (builder) => {
//     builder.addCase(getEmployee.fulfilled, (state, action) => {
//       const item : any = action.payload;
//       state.employee = item.data;
//       state.isloading = false;
//     });

//     builder.addCase(getEmployee.pending, (state, action) => {
//       state.isloading = true;
//     });
//   }
// });




// export const {  } = employeeSlice.actions;
// export const employeeSelector = (store: RootState) => store.employeeReducer;
// export default employeeSlice.reducer;