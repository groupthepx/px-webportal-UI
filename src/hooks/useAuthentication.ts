"use client";

import { useEffect } from "react";
import { useRouter, usePathname, redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useGetMemberByIdQuery, useGetProfileByIdQuery } from "@/lib/features/profile";
import { useDispatch } from "react-redux";
import { resetState } from "@/lib/userActions";
import { apiSlice } from "@/utils/apiSlice";
import { handleForceLogout } from "@/utils/authUtils";
const useAuthentication = () => {
  const router = useRouter();
  const currentRoute = usePathname();
 const dispatch = useDispatch();
  const { data: session , status } : any = useSession();

  const { data: ProfileById, isLoading: isLoadingProfilegById } = useGetProfileByIdQuery(
   );
 
   const memberParamsId = !isLoadingProfilegById && ProfileById && ProfileById.data && ProfileById.data.member_id ? `${ProfileById.data.member_id}` : '0';
 
  const { data: memberById, isLoading: isLoadingMemberById  } = useGetMemberByIdQuery(
    { id: `${memberParamsId}` },
    { skip: memberParamsId === '0' }
  );



  useEffect(() => {

    if (status === 'loading') {
      // Optionally handle the loading state
      return;
    } 


    if (status !== 'loading' && session && session?.error === "RefreshTokenExpired") {
      console.error("Session error detected:", session.error);
      dispatch(resetState());
      dispatch(apiSlice.util.resetApiState());
      handleForceLogout(dispatch, router);
      return;
    }


    
      
      if (status === "unauthenticated" 
        // && !GUEST_ROUTES.includes(currentRoute)
      ) {
        // router.push(LOGIN_ROUTE);
       
        redirect(`${'/login'}`);
        return;
      }
   
      const  profileDetail = memberById && memberById.data  || '';
    

      if(profileDetail && profileDetail.is_active === false) {
     

        handleForceLogout(dispatch, router, '/login?error=Ban');
      }


      if (status === "authenticated" && ['/profile'].includes(currentRoute)) {
        // router.push("/");
   
        // redirect(`${DASHBOARD_PATH}`);
        return;
      }
    
 


  }, [status, currentRoute, router, memberById]);

  return null;
};

export default useAuthentication;
