// import React, { useContext, useState } from 'react';
// import axios from 'axios';
// import { AdminContext } from '../context/AdminContext';
// import { toast } from 'react-toastify';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { setaToken, backendUrl } = useContext(AdminContext);

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();

//     if (!email || !password) {
//       toast.error("Please fill in all fields");
//       return;
//     }

//     try {
//       const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });

//       if (data.success) {
//         localStorage.setItem('aToken', data.token);
//         setaToken(data.token);
//         toast.success('Login Successful');
//       } else {
//         toast.error(data.message || 'Invalid credentials');
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error(error.response?.data?.message || "Server error. Try again later.");
//     }
//   };

//   return (
//     <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
//       <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-black-600 text-sm shadow-lg'>
//         <p className='text-2xl font-semibold m-auto'>Admin Login</p>
//         <div className='w-full'>
//           <p>Email</p>
//           <input
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//             className='border border-[#DADADA] rounded w-full p-2 mt-1'
//             type="email"
//             required
//           />
//         </div>
//         <div className='w-full'>
//           <p>Password</p>
//           <input
//             onChange={(e) => setPassword(e.target.value)}
//             value={password}
//             className='border border-[#DADADA] rounded w-full p-2 mt-1'
//             type="password"
//             required
//           />
//         </div>
//         <button type="submit" className='bg-primary text-black w-full py-2 rounded-md text-base'>Login</button>
//       </div>
//     </form>
//   );
// };

// export default Login;
